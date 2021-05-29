const assert = require('assert');

const ScoreMachine = require('./score');
const Web3Wrap = require('./web3Wrapper')
const {batch} = require("./batch")

const web3 = Web3Wrap.getWeb3()

const { erc20Abi } = require("./erc20Abi");

const bproAddress = "0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"

const bproUniV2Address = "0x288d25592a995cA878B79762Cb8Ec5a95d2e888a"
const proUniV2StartBlock = 12334410

const bproSushiAddress = "0x4a8428d6a407e57fF17878e8DB21b4706116606F"
const proSushiStartBlock = 12519244

function minus(bn) {
  return new web3.utils.toBN("-1").mul(new web3.utils.toBN(bn))
}

async function parseLPEvents(machine, name, poolAddress, startBlock, endBlock) {
    const lpTokenContract = new web3.eth.Contract(erc20Abi, poolAddress)
    const pastEvents = await lpTokenContract.getPastEvents('Transfer',
    {
      fromBlock : startBlock,
      toBlock : endBlock
    })

    for(e of pastEvents) {
        const to = e.returnValues.to
        const from = e.returnValues.from
        const amount = e.returnValues.value

        if(to !== "0x0000000000000000000000000000000000000000") {
          machine.setRelevantUser(to)
        }

        if(from !== "0x0000000000000000000000000000000000000000") {
          machine.setRelevantUser(from)
        }

        machine.addDelta(to, e.blockNumber, amount, 1, name)
        machine.addDelta(from, e.blockNumber, minus(amount), 1, name)
    }
}

async function setInitialLPBalance(machine, name, poolAddress, block) {
  const users = machine.getAllUsers()
  const calls = []
  for(u of users) {
    calls.push({address: poolAddress, abi: erc20Abi, method: "balanceOf", params: [u]})
  }

  const balances = await batch(calls, block)
  let nonZero = 0
  for(let i = 0 ; i < users.length ; i++) {
    machine.setInitialBalance(users[i], block, balances[i], 1, name)
    if(Number(web3.utils.fromWei(balances[i])) > 0) {
      nonZero++
      console.log(users[i], Number(web3.utils.fromWei(balances[i])))
    }
  }

  console.log({nonZero})
}

async function parseBproEvents(machine, name, poolAddress, startBlock, endBlock) {
  const tokenContract = new web3.eth.Contract(erc20Abi, bproAddress)
  const pastFromEvents = await tokenContract.getPastEvents('Transfer',
  {
    filter: {from: poolAddress},
    fromBlock : startBlock,
    toBlock : endBlock
  })

  const pastToEvents = await tokenContract.getPastEvents('Transfer',
  {
    filter: {to: poolAddress},
    fromBlock : startBlock,
    toBlock : endBlock
  })

  const pastEvents = pastFromEvents.concat(pastToEvents)
  console.log(pastEvents.length, pastFromEvents.length, pastToEvents.length)

  machine.setRelevantUser(poolAddress)  

  for(e of pastEvents) {
    const to = e.returnValues.to
    const from = e.returnValues.from
    const amount = e.returnValues.value

    machine.addDelta(to, e.blockNumber, amount, 1, name)
    machine.addDelta(from, e.blockNumber, minus(amount), 1, name)
  }  
}

async function setInitialBproBalance(machine, name, poolAddress, block) {
  const tokenContract = new web3.eth.Contract(erc20Abi, bproAddress)
  const balance = await tokenContract.methods.balanceOf(poolAddress).call(block)
  console.log({balance})
  machine.setInitialBalance(poolAddress, block, balance, 1, name)

  return balance
}

function fromWei(num) {
  return Number(web3.utils.fromWei(num))
}

function calcUserScore(startIndex, endIndex, userLPBalances, poolTotalSupplies, poolBproBalances, totalBproBalances) {
  let score = 0.0
  const scorePerBlock = 0.211398613
  for(let i = startIndex ; i < endIndex ; i++) {
    const userLPBalance = fromWei(userLPBalances[i])
    const poolLPTotalSupply = fromWei(poolTotalSupplies[i])
    const poolBroBalance = fromWei(poolBproBalances[i])
    const totalBproBalance = fromWei(totalBproBalances[i])

    if(poolLPTotalSupply === 0 || totalBproBalance === 0) continue

    score += (userLPBalance / poolLPTotalSupply) * (poolBroBalance / totalBproBalance)
    //console.log({score}, {userLPBalance}, {poolLPTotalSupply}, {poolBroBalance}, {totalBproBalance})    
  }

  return score * scorePerBlock
}

async function main() {
  let latest = await web3.eth.getBlockNumber() - 5
  if(latest > 14085231) latest = 14085231

  const bproMachine = new ScoreMachine(web3)
  let name = "bpro"
  await parseBproEvents(bproMachine, name, bproUniV2Address, proUniV2StartBlock, latest)
  await parseBproEvents(bproMachine, name, bproSushiAddress, proSushiStartBlock, latest)  
  const uniBalance = await setInitialBproBalance(bproMachine, name, bproUniV2Address, latest)
  const sushiBalance = await setInitialBproBalance(bproMachine, name, bproSushiAddress, latest)

  const uniLPmachine = new ScoreMachine(web3)
  name = "uniswap LP"
  await parseLPEvents(uniLPmachine, name, bproUniV2Address, proUniV2StartBlock, latest)
  await setInitialLPBalance(uniLPmachine, name, bproUniV2Address, latest)

  const sushiLPmachine = new ScoreMachine(web3)
  name = "sushi LP"
  await parseLPEvents(sushiLPmachine, name, bproSushiAddress, proSushiStartBlock, latest)
  await setInitialLPBalance(sushiLPmachine, name, bproSushiAddress, latest)    

  const bipStartBlock = proUniV2StartBlock
  const uniswapLPBalances = uniLPmachine.getBalanceArray(uniLPmachine.getAllUsers(), bipStartBlock)
  const sushiswapLPBalances = sushiLPmachine.getBalanceArray(sushiLPmachine.getAllUsers(), bipStartBlock)
  const uniswapBproBalances = bproMachine.getBalanceArray([bproUniV2Address], bipStartBlock)
  const sushiwapBproBalances = bproMachine.getBalanceArray([bproSushiAddress], bipStartBlock)  
  const bproTotalBalances = bproMachine.getBalanceArray([bproSushiAddress, bproUniV2Address], bipStartBlock)

  const score = {}
  const allUsers = (uniLPmachine.getAllUsers()).concat(sushiLPmachine.getAllUsers())
  for(u of allUsers) score[u] = 0.0

  // go over sushiswap users
  console.log("sushi")
  const sushiswapUsers = sushiLPmachine.getAllUsers()
  for(user of sushiswapUsers) {
    console.log({user})
    const userLPBalances = sushiLPmachine.getBalanceArray([user], bipStartBlock)
    score[user] += calcUserScore(0, latest - bipStartBlock, userLPBalances, sushiswapLPBalances, sushiwapBproBalances, bproTotalBalances)    
  }

  console.log({score})

  console.log("uni")  
  // go over uniswap users
  const uniswapUsers = uniLPmachine.getAllUsers()
  for(uniUser of uniswapUsers) {
    console.log({uniUser})
    const userLPBalances = uniLPmachine.getBalanceArray([uniUser], bipStartBlock)
    score[uniUser] += calcUserScore(0, latest - bipStartBlock, userLPBalances, uniswapLPBalances, uniswapBproBalances, bproTotalBalances)    
  }  

  console.log({score})
  test(score, bipStartBlock, latest)
  console.log({sushiBalance}, {uniBalance})
  return { "rewards" : score,
           "totalBalance" : fromWei(sushiBalance) + fromWei(uniBalance)}  
}


function test(score, start, end) {
  let total = 0
  for(key in score) {
    total += score[key]
  }

  console.log({total}, end-start)
}

main()