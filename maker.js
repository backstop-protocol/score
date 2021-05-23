const ScoreMachine = require('./score');
const {batch} = require("./batch")

const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()

const fourBytesLen = 10

const { vatAbi, bcdpManagerAbi, dsProxyAbi } = require("./makerAbi");
const { testAddress } = require('web3-utils');
const vatAddress = "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B"
const bcdpManagerAddress = "0x3f30c2381CD8B917Dd96EB2f1A4F96D91324BBed"

const frobSig = web3.utils.soliditySha3('frob(bytes32,address,address,address,int256,int256)').substring(0, fourBytesLen) + "00000000000000000000000000000000000000000000000000000000"
const forkSig = web3.utils.soliditySha3('fork(bytes32,address,address,int256,int256)').substring(0, fourBytesLen) + "00000000000000000000000000000000000000000000000000000000"
const grabSig = web3.utils.soliditySha3('grab(bytes32,address,address,address,int256,int256)').substring(0, fourBytesLen) + "00000000000000000000000000000000000000000000000000000000"


const ETHA = "0x4554482d41000000000000000000000000000000000000000000000000000000"
const ETHB = "0x4554482d42000000000000000000000000000000000000000000000000000000"
const ETHC = "0x4554482d43000000000000000000000000000000000000000000000000000000"

function minus(bn) {
  return new web3.utils.toBN("-1").mul(new web3.utils.toBN(bn))
}

async function filter(startBlock, endBlock, collateralMachine, debtMachine, ethRate, artRate) {
    const pastEvents = await web3.eth.getPastLogs({
      address: [vatAddress],
      topics: [[frobSig, grabSig, forkSig]],
      fromBlock : startBlock,
      toBlock : endBlock
    })

    for(e of pastEvents) {
        const data = e.data
        const sig = e.topics[0] // why? because
        const importantData = "0x" + data.substring(138,data.length)
        if(sig === frobSig) {
          // u get more dink ether and dart dai debt. rest does not matter
          const decodedData = web3.eth.abi.decodeParameters([
            {'type': 'bytes32','name': 'ilk'},
            {'type': 'address','name': 'u'},
            {'type': 'address','name': 'v'},
            {'type': 'address','name': 'w'},
            {'type': 'int256','name': 'dink'},
            {'type': 'int256','name': 'dart'}
          ], importantData)
          collateralMachine.addDelta(decodedData.u, e.blockNumber,decodedData.dink, ethRate, "maker_" + decodedData.ilk.toString())
          debtMachine.addDelta(decodedData.u, e.blockNumber, decodedData.dart, artRate[decodedData.ilk], "maker_" + decodedData.ilk.toString())

          if(decodedData.u.toString().toLowerCase() === "0xC10781aEFdB97AD3BE4f482a9743875CB13757C8".toLowerCase()) console.log("frob")
        }
        if(sig === grabSig) {
          // u get more dink and dart, rest does not matter.
          const decodedData = web3.eth.abi.decodeParameters([
            {'type': 'bytes32','name': 'ilk'},
            {'type': 'address','name': 'u'},
            {'type': 'address','name': 'v'},
            {'type': 'address','name': 'w'},
            {'type': 'int256','name': 'dink'},
            {'type': 'int256','name': 'dart'}
            ], importantData)
            if(decodedData.u.toString().toLowerCase() === "0xC10781aEFdB97AD3BE4f482a9743875CB13757C8".toLowerCase()) console.log("grab")

          collateralMachine.addDelta(decodedData.u, e.blockNumber, decodedData.dink, ethRate, "maker_" + decodedData.ilk.toString())
          debtMachine.addDelta(decodedData.u, e.blockNumber, decodedData.dart, artRate[decodedData.ilk], "maker_" + decodedData.ilk.toString())
        }
        if(sig === forkSig) {
          // src get minus dink and dart, dest get plus dink and dart
          const decodedData = web3.eth.abi.decodeParameters([
            {'type': 'bytes32','name': 'ilk'},
            {'type': 'address','name': 'src'},
            {'type': 'address','name': 'dst'},
            {'type': 'int256','name': 'dink'},
            {'type': 'int256','name': 'dart'}
            ], importantData)
            if(decodedData.dst.toString().toLowerCase() === "0xC10781aEFdB97AD3BE4f482a9743875CB13757C8".toLowerCase()) console.log("fork dst")
            if(decodedData.src.toString().toLowerCase() === "0xC10781aEFdB97AD3BE4f482a9743875CB13757C8".toLowerCase()) console.log("fork dst")            

          collateralMachine.addDelta(decodedData.dst, e.blockNumber, decodedData.dink, ethRate, "maker_"  + decodedData.dink.toString())
          debtMachine.addDelta(decodedData.dst, e.blockNumber, decodedData.dart, artRate[decodedData.ilk], "maker_" + decodedData.ilk.toString())

          collateralMachine.addDelta(decodedData.src, e.blockNumber, minus(decodedData.dink), ethRate, "maker_" + decodedData.ilk.toString())
          debtMachine.addDelta(decodedData.src, e.blockNumber, minus(decodedData.dart), artRate[decodedData.ilk], "maker_" + decodedData.ilk.toString())
      	}
    }
}

async function getUrnToUserMapping() {
  const cdpManager = new web3.eth.Contract(bcdpManagerAbi, bcdpManagerAddress)
  const cdpi = Number(await cdpManager.methods.cdpi().call())

  const urnCalls = []
  const ownCalls = []  
  for(let i = 1 ; i <= cdpi ; i++) {
    urnCalls.push({address: bcdpManagerAddress, abi: bcdpManagerAbi, method: "urns", params: [i]})
    ownCalls.push({address: bcdpManagerAddress, abi: bcdpManagerAbi, method: "owns", params: [i]})
  }

  const urns = await batch(urnCalls, "latest")
  const owns = await batch(ownCalls, "latest")
  
  const proxyOwnerCalls = []
  for(let i = 0 ; i < cdpi ; i++) {
    proxyOwnerCalls.push({address: owns[i], abi: dsProxyAbi, method: "owner", params: []})
  }

  const owners = await batch(proxyOwnerCalls, "latest")

  const mapping = {}

  for(let i = 0 ; i < urns.length ; i++) {
    mapping[urns[i].toLowerCase()] = owners[i].toLowerCase()
  }

  return mapping
}


async function initUsersBatch(collateralMachine, debtMachine, ethRate, artRate, validIlks, block) {
  //const vat = new web3.eth.Contract(vatAbi, vatAddress)
  const cdpManager = new web3.eth.Contract(bcdpManagerAbi, bcdpManagerAddress)

  //const block = await web3.eth.getBlockNumber() - 10 // minus 10 to avoid reorg

  const cdpi = Number(await cdpManager.methods.cdpi().call())

  const ilkCalls = []
  const urnCalls = []
  let i
  for(i = 1 ; i <= cdpi ; i++) {
    ilkCalls.push({address: bcdpManagerAddress, abi: bcdpManagerAbi, method: "ilks", params: [i]})
    urnCalls.push({address: bcdpManagerAddress, abi: bcdpManagerAbi, method: "urns", params: [i]})
  }

  const ilks = await batch(ilkCalls, block)
  const urns = await batch(urnCalls, block)

  const balanceCalls = []
  for(i = 0 ; i < cdpi ; i++) {
    balanceCalls.push({address: vatAddress, abi: vatAbi, method: "urns", params: [ilks[i], urns[i]]})
  }
  console.log("reading balances")
  const balances = await batch(balanceCalls, block)
  //console.log({balances})

  const debts = []
  const collateral = []
  const users = []

  for(let i = 0 ; i < cdpi ; i++) {
    const urn = urns[i]
    const ilk = ilks[i]


    const balance = balances[i]
    const ink = balance[0]
    const art = balance[1]

    debts.push(art)
    collateral.push(ink)
    users.push(urn)

    //console.log({ilk}, {validIlks}, ilk in validIlks)
    if(! validIlks.includes(ilk)) continue

    if((collateralMachine !== null) && (debtMachine !== null)) {
      collateralMachine.setRelevantUser(urn)
      debtMachine.setRelevantUser(urn)
      collateralMachine.setInitialBalance(urn, block, ink, ethRate,  "maker_" + ilk.toString())
      debtMachine.setInitialBalance(urn, block, art, artRate[ilk], "maker_" + ilk.toString())
    }
  }

  //console.log({balances})
  //sd
  const output = { "block" : block, "users" : users, "borrowBalances" : debts, "collateralBalances" : collateral }

  return output
}

async function runMaker(ethRate, artRate, collateralMachine, debtMachine, startBlock) {
  //const collateralMachine = new ScoreMachine(web3)
  //const debtMachine = new ScoreMachine(web3)
  //const startBlock = 11081908
  //const ethRate = web3.utils.toWei("2200")
  const block = await web3.eth.getBlockNumber() - 10 // minus 10 to avoid reorg

  if(! artRate[ETHA]) {
    console.log("making a dicionary from art rate")
    artRate = { [ETHA] : artRate, [ETHB] : artRate, [ETHC] : artRate }
  }

  const res = await initUsersBatch(collateralMachine, debtMachine, ethRate, artRate, [ETHA, ETHB, ETHC], block)
  const endBlock = res.block
  console.log({endBlock})
  const step = 2e4

  console.log("finish init users")

  for(let i = startBlock ; i <= endBlock ; i += step) {
    console.log({i})
    const lastBlock = (i + step - 1) > endBlock ? endBlock : (i + step - 1)
    await filter(i, lastBlock, collateralMachine, debtMachine, ethRate, artRate)
  }
  
  //const ilk = "0x4554482d41000000000000000000000000000000000000000000000000000000"
  //balances.getCollateralBalances(balances.getAllUsers(), ilk, startBlock, endBlock, eposhEndBlock)
  //collateralMachine.getUserScoreArray(startBlock, endBlock)
  //debtMachine.getUserScoreArray(startBlock, endBlock)  

  console.log(endBlock - startBlock)


  //console.log(JSON.stringify(balances))
}



async function getArtRate(block) {
  const vat = new web3.eth.Contract(vatAbi, vatAddress)
  const ilkInfoA = await vat.methods.ilks(ETHA).call(block)
  const ilkInfoB = await vat.methods.ilks(ETHB).call(block)
  const ilkInfoC = await vat.methods.ilks(ETHC).call(block)    

  const rateBNA = new web3.utils.toBN(ilkInfoA.rate)
  const rateBNB = new web3.utils.toBN(ilkInfoB.rate)
  const rateBNC = new web3.utils.toBN(ilkInfoC.rate)

  const rayToWadFactor = new web3.utils.toBN(1e9)

  return { [ETHA] : rateBNA.div(rayToWadFactor), [ETHB] : rateBNB.div(rayToWadFactor), [ETHC] : rateBNC.div(rayToWadFactor) }
}

async function getBalances(block) {
  const output = await initUsersBatch(null, null, null, null, [ETHA, ETHB, ETHC], block)

  return output
}

module.exports.runMaker = runMaker
module.exports.getArtRate = getArtRate
module.exports.getBalances = getBalances
module.exports.getUrnToUserMapping = getUrnToUserMapping