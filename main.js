const ScoreMachine = require('./score')
const Maker = require('./maker')
const Compound = require('./compound')
const Liquity = require('./liquity')
const MerkleEncode = require('./merkleEncode')
const Web3Wrap = require('./web3Wrapper')
const fs = require('fs');


const assert = require("assert")

const cBAT = "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e"
const cCOMP = "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4"
const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"
const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"
const cUNI = "0x35a18000230da775cac24873d00ff85bccded550"
const cUSDC = "0x39aa39c021dfbae8fac545936693ac917d5e7563"
const cUSDT = "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9"
const cWBTC = "0xc11b1268c1a384e55c48c2391d8d480264a3a7f4"
const cWBTC2 = "0xccf4429db6322d5c611ee964527d42e5d685dd6a"
const cZRX = "0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407"
const cAAVE = "0xe65cdb6479bac1e22340e4e755fae7e509ecd06c" 
const cMKR = "0x95b4ef2869ebd94beb4eee400a99824bf5dc325b"
const cSUSHI = "0x4b0181102a0112a2ef11abee5563bb4a3176c9d7"
const cLINK = "0xface851a4921ce59e912d19329929ce6da6eb0c7"
const cTUSD = "0x12392f67bdf24fae0af363c24ac620a2f67dad86"
const cYFI = "0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946"


const start = 12304534
//const curr = 12304534
const snapshotEnd = 12347296

const ctokens = [cETH, cBAT, cCOMP, cDAI, cUNI, cUSDC, cUSDT, cWBTC, cZRX, cAAVE, cMKR, cSUSHI, cLINK, cTUSD, cWBTC2, cYFI]

const ETHA = "0x4554482d41000000000000000000000000000000000000000000000000000000"
const ETHB = "0x4554482d42000000000000000000000000000000000000000000000000000000"
const ETHC = "0x4554482d43000000000000000000000000000000000000000000000000000000"
const WBTCA = "0x574254432d410000000000000000000000000000000000000000000000000000"

const web3 = Web3Wrap.getWeb3();

const collateralMachine = new ScoreMachine(web3)
const debtMachine = new ScoreMachine(web3)
const v2Machine = new ScoreMachine(web3)

async function initDB(startBlock, prevJson) {
    const rates = await Compound.getRates(ctokens, "latest")//prevJson["rates"]["compRates"]
    //const rates = await Compound.getRates(ctokens, blockPrice)
    assert(ctokens[0] === cETH, "first ctoken should be eth")
    assert(ctokens[ctokens.length - 2] === cWBTC2, "second ctoken before last should be wbtc")    

    const ethRate = {}
    ethRate[ETHA] = ethRate[ETHB] = ethRate[ETHC] = rates["underlyingRate"][0]
    const wbtcRate = rates["underlyingRate"][ctokens.length - 2]
    const normWbtcRate = new web3.utils.toBN(rates["underlyingRate"][ctokens.length - 2]).div(new web3.utils.toBN(10).pow(new web3.utils.toBN(10)))
    ethRate[WBTCA] = normWbtcRate.toString(16)
    const artRate = prevJson["rates"]["artRate"]
    //await Maker.getArtRate(blockPrice)

    console.log({rates}, {artRate},{ethRate})

    await Maker.runMaker(ethRate, artRate, collateralMachine, debtMachine, startBlock)
    await Compound.runCompound(ctokens, rates["ctokenRate"], rates["underlyingRate"], collateralMachine, debtMachine, startBlock)
    await Liquity.runLiquity("0x0d3AbAA7E088C2c82f54B2f47613DA438ea8C598", v2Machine, startBlock)
    await Liquity.runLiquity("0x0d3AbAA7E088C2c82f54B2f47613DA438ea8C598", collateralMachine, startBlock)
    await Liquity.runLiquity("0x0d3AbAA7E088C2c82f54B2f47613DA438ea8C598", debtMachine, startBlock)

    const newRates = await Compound.getRates(ctokens, "latest")
    const newArtRate = await Maker.getArtRate("latest")

    return { "compRates" : newRates, "artRate": newArtRate }
}

async function analyze(startBlock, endBlock) {
    //const users = collateralMachine.getAllUsers()
    //const allUserBalance = collateralMachine.getBalanceArray(users, startBlock, curr + 1000)
    //const allUserDebt = debtMachine.getBalanceArray(users, startBlock, curr + 1000)    
    
    const collatScores = collateralMachine.getUserScoreArray(startBlock, endBlock)
    const debtScores = debtMachine.getUserScoreArray(startBlock, endBlock)
    const v2Scores = v2Machine.getUserScoreArray(startBlock, endBlock)

    const output = { "startBlock" : startBlock, "endBlock" : endBlock, "collateralScores" : collatScores, "debtScores" : debtScores, "v2Scores" : v2Scores}
    if(!process.env.SERVERLESS){
        fs.writeFileSync('./scoreRawData.json', JSON.stringify(output, null, 2) , 'utf-8')
    }
    return JSON.stringify(output, null, 2)
}

async function generateAdditionalBProSnapshot(scoreRawJson) {
    const factor = new web3.utils.toBN("10").pow(new web3.utils.toBN("48"))
    const BLOCKS_PER_YEAR = 45 * 60 * 24 * 365 / 10 // 4.5 blocks per minute
    const BLOCKS_PER_MONTH = (BLOCKS_PER_YEAR / 12)
    const dripPerMonth = new web3.utils.toBN(web3.utils.toWei("90000")).div(new web3.utils.toBN(3))
    const dripPerBlock = dripPerMonth.div(new web3.utils.toBN(BLOCKS_PER_MONTH))

    console.log({dripPerBlock})

    const bproPerBlockCollat = dripPerBlock.div(new web3.utils.toBN(5))
    const bproPerBlockDebt = dripPerBlock.sub(bproPerBlockCollat)

    const rawScore = process.env.SERVERLESS ? scoreRawJson : fs.readFileSync('./scoreRawData.json');
    const scoreJson = JSON.parse(rawScore)

    let sumCollat = new web3.utils.toBN("0")
    let sumDebt = new web3.utils.toBN("0")

    console.log("getting maker users")
    const makerUsers = await Maker.getUrnToUserMapping()
    const compoundUsers = await Compound.getAvatarToUserMapping()
    console.log({makerUsers})
    console.log("done")

    const bproJson = {}
    bproJson["startBlock"] = scoreJson["startBlock"]
    bproJson["endBlock"] = scoreJson["endBlock"]
    bproJson["bpro"] = {}

    for(const user in scoreJson["collateralScores"]) {
        const score = new web3.utils.toBN("0x" + scoreJson["collateralScores"][user])
        const bpro = score.mul(bproPerBlockCollat).div(factor)

        let realUser
        let isMaker = false
        if(user in makerUsers) {
            //console.log("maker user")
            realUser = makerUsers[user].toLowerCase()
            isMaker = true
        }
        else if(user in compoundUsers) realUser = compoundUsers[user].toLowerCase()
        else realUser = user.toLocaleLowerCase() // v2 user

        if(! (realUser in bproJson["bpro"])) {
            bproJson["bpro"][realUser] = { "total" : new web3.utils.toBN("0"), "maker" : new web3.utils.toBN("0")}
        }

        bproJson["bpro"][realUser]["total"] = bproJson["bpro"][realUser]["total"].add(bpro)
        if(isMaker) bproJson["bpro"][realUser]["maker"] = bproJson["bpro"][realUser]["maker"].add(bpro)

        sumCollat = sumCollat.add(bpro)
    }


    for(const user in scoreJson["debtScores"]) {
        const score = new web3.utils.toBN("0x" + scoreJson["debtScores"][user])
        const bpro = score.mul(bproPerBlockDebt).div(factor)

        let realUser = user
        let isMaker = false
        if(user in makerUsers) {
            //console.log("maker user")
            realUser = makerUsers[user]
            isMaker = true
        }
        else if(user in compoundUsers) realUser = compoundUsers[user].toLowerCase()
        else realUser = user.toLocaleLowerCase() // v2 user

        if(! (realUser in bproJson["bpro"])) {
            bproJson["bpro"][realUser] = { "total" : new web3.utils.toBN("0"), "maker" : new web3.utils.toBN("0")}
        }

        bproJson["bpro"][realUser]["total"] = bproJson["bpro"][realUser]["total"].add(bpro)
        if(isMaker) bproJson["bpro"][realUser]["maker"] = bproJson["bpro"][realUser]["maker"].add(bpro)


        sumDebt = sumDebt.add(bpro)
    }

    bproJson["sumDebt"] = sumDebt
    bproJson["sumCollat"] = sumCollat
    if(!process.env.SERVERLESS){
        fs.writeFileSync('./bproAdditional.json', JSON.stringify(bproJson, null, 2) , 'utf-8')
    }
    console.log({sumCollat}, {sumDebt})
    return bproJson
}

async function main(startBlock, snapshotBlock, prevSnapshot) {
    const newRates = await initDB(startBlock, prevSnapshot)
    const analyzeRes = await analyze(startBlock, snapshotBlock)
    const bproAdditionalJson = await generateAdditionalBProSnapshot(analyzeRes)

    console.log("encoding snapshot")

    const snapshotJson = await MerkleEncode.encodeClaims(bproAdditionalJson, prevSnapshot, newRates)

    // fs.writeFileSync('./snapshotJson.json', JSON.stringify(snapshotJson, null, 2) , 'utf-8')

    console.log({newRates})

    return JSON.stringify(snapshotJson, null, 2)

    //MerkleEncode.testClaims('./snapshotJson.json')
}



//main(start, snapshotEnd)


async function test(blockToTest, blockPrice) {
    if(blockPrice === "latest") {
        blockPrice = await web3.eth.getBlockNumber() - 5
    }


    const rates = await Compound.getRates(ctokens, blockPrice)
    console.log({rates})

    assert(ctokens[0] === cETH, "first ctoken should be eth")

    const ethRate = new web3.utils.toBN(rates["underlyingRate"][0])
    const artRate = new web3.utils.toBN(await Maker.getArtRate(blockPrice))

    const debts = {}
    const collat = {}

    const compoundBalances = await Compound.getBalances(ctokens, blockToTest)
    const compoundUsers = compoundBalances.users
    for(const avatar of compoundUsers) {
        debts[avatar] = new web3.utils.toBN("0")
        collat[avatar] = new web3.utils.toBN("0")
        
        for(let i = 0 ; i < ctokens.length ; i++) {
            ctoken = ctokens[i]
            //console.log({avatar})
            const debt = new web3.utils.toBN(compoundBalances["balances"][avatar][ctoken]["debt"])
            const collateral = new web3.utils.toBN(compoundBalances["balances"][avatar][ctoken]["collateral"])
            
            const debtInUsd = debt.mul(rates["underlyingRate"][i])
            const collatInUsd = collateral.mul(rates["ctokenRate"][i])

            debts[avatar] = debts[avatar].add(debtInUsd)
            collat[avatar] = collat[avatar].add(collatInUsd)

            if(avatar === "0xf258391e3dAA6c80ec11e9808c9775574137dBd9") {
                console.log("eitan",debtInUsd.toString(), {ctoken},{debt},rates["underlyingRate"][i].toString(), rates["ctokenRate"][i].toString())
            }
        }

        //console.log(debts[avatar], collat[avatar])

        //if(avatar === "0xf258391e3dAA6c80ec11e9808c9775574137dBd9") assert(false)        
    }

    const makerBalances = await Maker.getBalances(blockToTest)

    // user to usd value
    const makerUsers = makerBalances.users
    const makerDebts = makerBalances.borrowBalances
    const makerCollt = makerBalances.collateralBalances

    for(let i = 0 ; i < makerUsers.length ; i++) {
        debts[makerUsers[i]] = (new web3.utils.toBN(makerDebts[i])).mul(artRate)
        collat[makerUsers[i]] = (new web3.utils.toBN(makerCollt[i])).mul(ethRate)
    }
    
    console.log("init db")
    await initDB(start, blockPrice)

    const endBlock = await web3.eth.getBlockNumber()    

    for(let user in collat) {
        const realCollat = collat[user]
        const collatArray = collateralMachine.getBalanceArray([user], start, endBlock)
        const collateral = collatArray[blockToTest - start]

        console.log({collateral}, {realCollat}, {blockToTest}, {user})

        assert(prettyClose(collateral, realCollat), user.toString())        
        //assert.equal(collateral.toString(), realCollat.toString(), user.toString())
    }


    for(let user in debts) {
        //if(user !== "0xf258391e3dAA6c80ec11e9808c9775574137dBd9") continue
        //user = "0xC10781aEFdB97AD3BE4f482a9743875CB13757C8"
        //console.log(user)
        const realDebt = debts[user]
        const debtArray = debtMachine.getBalanceArray([user], start, endBlock)
        const debt = debtArray[blockToTest - start]

        console.log({realDebt}, {debt}, {blockToTest}, {user})
        //console.log(JSON.stringify(debtArray))
        assert(prettyClose(debt, realDebt), user.toString())
        //assert.equal(debt.toString(), realDebt.toString(), user.toString())
    }


    console.log("succ")

    return

    console.log("testing user 123")
    const makerUser = makerUsers[123]
    console.log({makerUser})
    console.log(collat[makerUser])
    
    const userBalanceArray = collateralMachine.getBalanceArray([makerUser],start, endBlock)
    const index = blockToTest - start
    console.log({userBalanceArray})
    console.log(userBalanceArray[index])

    //console.log(JSON.stringify(makerBalances))
    //console.log(JSON.stringify(debts))
    //console.log(JSON.stringify(collat))        
}

//test(curr, "latest")

//Compound.getDebt(ctokens, "0x56D419Da994b1d12d9BF83563541d2E96742C329", 12328798)

function prettyClose(num1, num2) {
    const bigNum1 = new web3.utils.toBN(num1)
    const bigNum2 = new web3.utils.toBN(num2)

    const _1000 = new web3.utils.toBN(1000)
    const _1001 = new web3.utils.toBN(1001)

    const _1e18 = new web3.utils.toBN(web3.utils.toWei("1"))
    const _1e36 = _1e18.mul(_1e18)

    const small = _1e36.mul(new web3.utils.toBN(10))
    
    if(bigNum1.lt(small) && bigNum2.lt(small)) return true

    if(bigNum1.mul(_1000).gt(bigNum2.mul(_1001))) return false
    if(bigNum2.mul(_1000).gt(bigNum1.mul(_1001))) return false

    return true
}

module.exports.main = main