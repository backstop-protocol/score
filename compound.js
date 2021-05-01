const assert = require('assert');

const ScoreMachine = require('./score');
const Web3Wrap = require('./web3Wrapper')
const {batch} = require("./batch")

const web3 = Web3Wrap.getWeb3()

const { cTokenAbi, registryAbi, comptrollerAbi, oracleAbi } = require("./compoundAbi");

const registryAddress = "0xbF698dF5591CaF546a7E087f5806E216aFED666A"
const comptrollerAddress = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"

function minus(bn) {
  return new web3.utils.toBN("-1").mul(new web3.utils.toBN(bn))
}

function collateralName(ctokenContract) {
  return "collat_" + ctokenContract.options.address.toString()
}

function debtName(ctokenContract) {
  return "debt_" + ctokenContract.options.address.toString()
}

async function filterCtokenCollat(ctokenContract, startBlock, endBlock, collateralMachine, ctokenRate) {
    const pastEvents = await ctokenContract.getPastEvents('Transfer',
    {
      fromBlock : startBlock,
      toBlock : endBlock
    })

    const name = collateralName(ctokenContract)
    for(e of pastEvents) {
        const to = e.returnValues.to
        const from = e.returnValues.from
        const amount = e.returnValues.amount

        //if(e.blockNumber === 12304587) console.log({e})

        collateralMachine.addDelta(to, e.blockNumber, amount, ctokenRate, name)
        collateralMachine.addDelta(from, e.blockNumber, minus(amount), ctokenRate, name)
    }
}

async function filterCtokenDebt(ctokenContract, startBlock, endBlock, debtMachine, underlyingRate) {
  const name = debtName(ctokenContract)

  // first repay borrow
  const pastEventsRepay = await ctokenContract.getPastEvents('RepayBorrow',
  {
    fromBlock : startBlock,
    toBlock : endBlock
  })

  for(e of pastEventsRepay) {
      const borrower = e.returnValues.borrower
      const amount = e.returnValues.repayAmount

      debtMachine.addDelta(borrower, e.blockNumber, minus(amount), underlyingRate, name)
  }

  // now for borrow
  const pastEventsBorrow = await ctokenContract.getPastEvents('Borrow',
  {
    fromBlock : startBlock,
    toBlock : endBlock
  })

  for(e of pastEventsBorrow) {
      const borrower = e.returnValues.borrower
      const amount = e.returnValues.borrowAmount

      debtMachine.addDelta(borrower, e.blockNumber, amount, underlyingRate, name)
  }  
}


async function initUsersBatch(avatars, collateralMachine, debtMachine, ctokenContract, ctokenRate, underlyingRate, block) {
  console.log({block})
  //const block = 12313038

  const borrowBalanceCalls = []
  const collateralBalanceCalls = []

  const ctokenAddress = ctokenContract.options.address
  for(avatar of avatars) {
    borrowBalanceCalls.push({address: ctokenAddress, abi: cTokenAbi, method: "borrowBalanceCurrent", params: [avatar]})
    collateralBalanceCalls.push({address: ctokenAddress, abi: cTokenAbi, method: "balanceOf", params: [avatar]})
  }

  console.log("xxx")
  const borrowBalances = await batch(borrowBalanceCalls, block)
  console.log("yyy")  
  const collatBalances = await batch(collateralBalanceCalls, block)
  console.log("zzz")

  let sumDebt = new web3.utils.toBN("0")
  let sumCollateral = new web3.utils.toBN("0")  

  for(let i = 0 ; i < avatars.length ; i++) {
    const debt = borrowBalances[i]
    const collateral = collatBalances[i]
    const user = avatars[i]

    if(user === "0xf258391e3dAA6c80ec11e9808c9775574137dBd9") {
      console.log({debt}, ctokenContract.options.address,"raw")
    }

    if(debtMachine !== null && collateralMachine !== null) {
      debtMachine.setRelevantUser(user)
      collateralMachine.setRelevantUser(user)

      debtMachine.setInitialBalance(user, block, debt, underlyingRate, debtName(ctokenContract))
      collateralMachine.setInitialBalance(user, block, collateral, ctokenRate, collateralName(ctokenContract))
    }

    sumDebt = sumDebt.add(new web3.utils.toBN(debt))
    sumCollateral = sumCollateral.add(new web3.utils.toBN(collateral))
  }

  console.log({sumCollateral}, {sumDebt})

  return { "block" : block, "borrowBalances" : borrowBalances, "collateralBalances" : collatBalances } 
}

async function runCompound(ctokenAddresses, ctokenRates, underlyingRates, collateralMachine, debtMachine, startBlock) {
  assert(ctokenAddresses.length === ctokenRates.length, "length missmatch")
  assert(ctokenAddresses.length === underlyingRates.length, "length missmatch")

  const registry = new web3.eth.Contract(registryAbi, registryAddress)
  const avatars = await registry.methods.avatarList().call()

  const endBlock = await web3.eth.getBlockNumber() - 10 // minus 10 to avoid reorg  

  for(let i = 0 ; i < ctokenAddresses.length ; i++) {
    const ctokenContract = new web3.eth.Contract(cTokenAbi, ctokenAddresses[i])

    await initUsersBatch(avatars, collateralMachine, debtMachine, ctokenContract, ctokenRates[i], underlyingRates[i], endBlock)

    console.log("AAA")
    const step = 2e4
    for(let b = startBlock ; b <= endBlock ; b += step) {
      const lastBlock = (b + step - 1) > endBlock ? endBlock : (b + step - 1)

      await filterCtokenCollat(ctokenContract, b, lastBlock, collateralMachine, ctokenRates[i])
      console.log("BBB")      
      await filterCtokenDebt(ctokenContract, b, lastBlock, debtMachine, underlyingRates[i])        
      console.log("CCC")            
    }      
  }
  
  return endBlock
}

async function test3() {
  const collateralMachine = new ScoreMachine(web3)
  const debtMachine = new ScoreMachine(web3)
  const startBlock = 12316453 - 5 * 60 * 24 * 7

  const ethRate = web3.utils.toWei("2200")
  const cEthRate = web3.utils.toWei("49.9077")

  const cEthAddrss = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5"

  const endBlock = await runCompound([cEthAddrss], [cEthRate], [ethRate], collateralMachine, debtMachine, startBlock)

  //const ilk = "0x4554482d41000000000000000000000000000000000000000000000000000000"
  //balances.getCollateralBalances(balances.getAllUsers(), ilk, startBlock, endBlock, eposhEndBlock)
  //collateralMachine.getUserScoreArray(startBlock, endBlock)
  collateralMachine.getUserScoreArray(startBlock, endBlock) 
}

// return ctoken rate and underlying rate
async function getRates(ctokens, block) {
  console.log({block})
  const _1e18 = new web3.utils.toBN(web3.utils.toWei("1"))

  const comptroller = new web3.eth.Contract(comptrollerAbi, comptrollerAddress)
  const oracleAddress = await comptroller.methods.oracle().call(block)
  console.log({oracleAddress})
  const oracle = new web3.eth.Contract(oracleAbi, oracleAddress)

  const ctokenRates = []
  const underlyingRates = []
  for(ctoken of ctokens) {
    console.log(ctoken)
    const ctokenContract = new web3.eth.Contract(cTokenAbi, ctoken)
    const exchangeRate = new web3.utils.toBN(await ctokenContract.methods.exchangeRateCurrent().call(block))
    const underlyingRate = new web3.utils.toBN(await oracle.methods.getUnderlyingPrice(ctoken).call(block))
    const ctokenRate = exchangeRate.mul(underlyingRate).div(_1e18)

    ctokenRates.push(ctokenRate)
    underlyingRates.push(underlyingRate)
  }

  return {"ctokenRate" : ctokenRates, "underlyingRate" : underlyingRates}
}

async function getBalances(ctokenAddresses, block) {
  const registry = new web3.eth.Contract(registryAbi, registryAddress)
  const avatars = await registry.methods.avatarList().call(block)

  const result = {"users" : avatars, "balances" : {}}

  for(const av of avatars) result["balances"][av] = {}

  for(let i = 0 ; i < ctokenAddresses.length ; i++) {
    const ctokenContract = new web3.eth.Contract(cTokenAbi, ctokenAddresses[i])

    const balances = await initUsersBatch(avatars, null, null, ctokenContract, null, null, block)
    for(let a = 0 ; a < avatars.length ; a++) {
      const av = avatars[a]
      result["balances"][av][ctokenAddresses[i]] = {"collateral" : balances.collateralBalances[a], "debt" : balances.borrowBalances[a]}
    }
  }

  console.log(result["balances"]["0xf258391e3dAA6c80ec11e9808c9775574137dBd9"])

  return result
}

async function getDebt(ctokenAddresses, user, block) {
  for(let i = 0 ; i < ctokenAddresses.length ; i++) {
    const ctokenContract = new web3.eth.Contract(cTokenAbi, ctokenAddresses[i])

    const borrowBalance = await ctokenContract.methods.borrowBalanceCurrent(user).call(block)
    const name = await ctokenContract.methods.name().call(block)

    console.log(name, borrowBalance.toString())
  }  
}

module.exports.runCompound = runCompound
module.exports.getRates = getRates
module.exports.getBalances = getBalances
module.exports.getDebt = getDebt
