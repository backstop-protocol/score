const assert = require("assert")

class ScoreMachine {
  // mapping: user, block number, asset => balance change
  constructor(web3) {
      this.balanceChanges = {}
      this.relevantUsers = {}
      this.initialBalanceBlock = {}
      this.balances = {} // user => asset => balance
      this.blockInit = {}
      this.web3 = web3
      this.maxBlock = 0
  }
  minus(bn) {
    return this.web3.utils.toBN("-1").mul(this.web3.utils.toBN(bn))
  }

  toKey(user, block) {
    return this.web3.utils.sha3(user.toString().toLowerCase() + ";" + block.toString().toLowerCase())
  }

  addToKey(key, delta) {
      if(! (key in this.balanceChanges)) this.balanceChanges[key] = new this.web3.utils.toBN("0")
      this.balanceChanges[key] = (this.balanceChanges[key]).add(new this.web3.utils.toBN(delta))
  }

  setRelevantUser(user) {
    this.relevantUsers[user.toString().toLowerCase()] = true
  }

  setInitialBalance(user, block, balance, rate, eventName) {
    const userLower = user.toString().toLowerCase()
    this.initialBalanceBlock[this.toKey(user,eventName)] = block
    this.addDelta(user, block, this.minus(balance), rate, eventName)
  }

  addDelta(user, block, delta, rate, eventName) {
    if(! (user.toString().toLowerCase() in this.relevantUsers)) return; // do nothing
    if(block > this.initialBalanceBlock[this.toKey(user,eventName)]) return; // do nothing

    const key = this.toKey(user, block)
    const value = this.web3.utils.toBN(delta).mul(new this.web3.utils.toBN(rate))

    
    if(user.toString().toLowerCase() === "0x56D419Da994b1d12d9BF83563541d2E96742C329".toLowerCase()) {
      if(delta.toString() !== "0") console.log({block}, delta.toString(), value.toString(), rate.toString(), {eventName})
    }
    
    this.addToKey(key, value)
    this.blockInit[block] = true

    if(block > this.maxBlock) this.maxBlock = block
  }

  getBalanceArray(users, startBlock) {
    //console.log({endBlock}, {startBlock})
    const endBlock = this.maxBlock + 1
    const balanceArray = new Array(endBlock + 1 - startBlock)
    let currBalance = new this.web3.utils.toBN("0")
    for(let i = endBlock ; i >= startBlock ; i--) {
      if(! (i in this.blockInit)) {
        balanceArray[i - startBlock] = currBalance        
        continue // optimization
      }

      for(const user of users) {      
        const key = this.toKey(user, i)
        let dbalance = new this.web3.utils.toBN("0")
        if(key in this.balanceChanges) dbalance = this.balanceChanges[key]
        currBalance = currBalance.sub(dbalance)
      }

      //assert(currBalance.gte(this.web3.utils.toBN("0")), "negative balance " + i.toString() + " " + currBalance.toString())
      if(currBalance.lte(this.web3.utils.toBN("0"))) currBalance = this.web3.utils.toBN("0")

      balanceArray[i - startBlock] = currBalance
      //console.log("balance ", i, currBalance.toString())
      //console.log({i})
    }

    return balanceArray
  }  

  getUserScoreArray(startBlock, endBlock) {
    const scores = {} // user => score
    const allBalances = this.getBalanceArray(this.getAllUsers(), startBlock)
    const factor = new this.web3.utils.toBN("10").pow(new this.web3.utils.toBN("48"))
    //console.log({factor})
    for(const user in this.relevantUsers) {
      const userBalances = this.getBalanceArray([user], startBlock)
      let score = new this.web3.utils.toBN("0")
      for(let i = startBlock ; i <= endBlock ; i++) {
        const index = i - startBlock
        //console.log(userBalances[index], allBalances[index], index + startBlock)
        const userBalance = new this.web3.utils.toBN(userBalances[index])
        if(userBalance.toString() !== "0") {
          const deltaScore = (factor.mul(userBalance)).div(new this.web3.utils.toBN(allBalances[index]))
          //console.log(userBalances[index], allBalances[index], (factor.mul(new this.web3.utils.toBN(userBalances[index]))), deltaScore)
          score = score.add(deltaScore)  
        }
      }

      scores[user] = score
      console.log({user})      
    }

    //console.log(JSON.stringify(scores), {startBlock}, {endBlock})
    //console.log(allBalances[endBlock - (endBlock - startBlock) / 2 - startBlock])
    return scores
  }

  getAllUsers() {
    return Object.keys(this.relevantUsers)
  }
}

module.exports = ScoreMachine