const ScoreMachine = require('./score');
const {batch} = require("./batch")

const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()

const fourBytesLen = 10

const { bammAbi, spAbi } = require("./liquityAbi");
const { testAddress } = require('web3-utils');

const _1e18 = new web3.utils.toBN(web3.utils.toWei("1"))

function minus(bn) {
  return new web3.utils.toBN("-1").mul(new web3.utils.toBN(bn))
}

function toName(address) {
  return "LUSD_" + address.toString()
}

async function filter(bammAddress, startBlock, endBlock, machine) {
    const bamm = new web3.eth.Contract(bammAbi, bammAddress)

    // first do deposits
    const pastDepositEvents = await bamm.getPastEvents('UserDeposit',
    {
      fromBlock : startBlock,
      toBlock : endBlock
    })

    for(e of pastDepositEvents) {
      const user = e.returnValues.user
      const amount = e.returnValues.lusdAmount

      if(user.toLowerCase() == "0x357dfdc34f93388059d2eb09996d80f233037cba") console.log("deposit" ,web3.utils.fromWei(amount))

      machine.addDelta(user, e.blockNumber, amount, _1e18, toName(bammAddress))
    }
    
    // now do withdraws
    const pastWithdrawEvents = await bamm.getPastEvents('UserWithdraw',
    {
      fromBlock : startBlock,
      toBlock : endBlock
    })

    for(e of pastWithdrawEvents) {
      const user = e.returnValues.user
      const amount = e.returnValues.lusdAmount

      if(user.toLowerCase() == "0x357dfdc34f93388059d2eb09996d80f233037cba") console.log("withdraw" ,web3.utils.fromWei(amount))      

      machine.addDelta(user, e.blockNumber, minus(amount), _1e18, toName(bammAddress))
    }
}

async function getAllUsers(bammAddress, currentBlock) {
  const users = []

  const bamm = new web3.eth.Contract(bammAbi, bammAddress)

  // first do deposits
  const pastDepositEvents = await bamm.getPastEvents('UserDeposit',
  {
    fromBlock: 0,
    toBlock : currentBlock
  })

  for(e of pastDepositEvents) {
    const user = e.returnValues.user
    if(! users.includes(user)) users.push(user)
  }

  return users
}

async function initUsersBatch(bammAddress, machine, block) {
  const users = await getAllUsers(bammAddress, block)
  //console.log({users})

  const balanceOfCalls = []
  for(const u of users) {
    balanceOfCalls.push({address: bammAddress, abi: bammAbi, method: "balanceOf", params:[u]})
  }
  const shares = await batch(balanceOfCalls, block)

  const bamm = new web3.eth.Contract(bammAbi, bammAddress)  
  const totalSupply = await bamm.methods.totalSupply().call(block)

  const sp = new web3.eth.Contract(spAbi, "0x66017D22b0f8556afDd19FC67041899Eb65a21bb")
  const lusdBalance = await sp.methods.getCompoundedLUSDDeposit(bammAddress).call(block)

  const toBN = web3.utils.toBN
  for(let i = 0 ; i < users.length ; i++) {
    const user = users[i]
    const balance = (toBN(shares[i]).mul(toBN(lusdBalance))).div(toBN(totalSupply))
    //console.log(user, web3.utils.fromWei(balance.toString()))
    machine.setRelevantUser(user)
    machine.setInitialBalance(user, block, balance, _1e18, toName(bammAddress))

    if(user.toLowerCase() == "0x357dfdc34f93388059d2eb09996d80f233037cba") console.log("balance" ,web3.utils.fromWei(balance))          
  }
}

async function runLiquity(bammAddress, machine, startBlock) {
  const block = await web3.eth.getBlockNumber() - 10 // minus 10 to avoid reorg

  await initUsersBatch(bammAddress, machine, block)
  console.log("liquity: finish init users")

  await filter(bammAddress, startBlock, block, machine)
  console.log("liquity: finish filter")  
}

module.exports.runLiquity = runLiquity
