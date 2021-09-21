const {batch} = require("./batch")
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs');

const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()

const { rewardsDistributorAbi } = require("./merkleEncodeAbi");
const assert = require("assert");
const rewardsDistributorAddress = "0xAf50fe9282e1bE8C08b899a51628a085E81d0D57"

const BPROAddress = "0xC7F0e3118B24f30A6Aa7d703E198996F04B64e32"

async function encodeClaims(bproJson, prevJson, rates) {
    const calls = []
    let index = 0

    const cycle = prevJson["cycle"] ? prevJson["cycle"] + 1 : 3

    const claimJson = {"userData" :{}}
    const uniqueUsers = []

    let sum = new web3.utils.toBN("0")

    // users array - not unique
    /*
    console.log({bproJson})
    console.log(bproJson["bpro"])
    console.log({prevJson})    
    console.log(prevJson["userData"])    */
    
    const users = Object.keys(bproJson["bpro"]).concat(Object.keys(prevJson["userData"]))

    for(const user of users /*in bproJson["bpro"]*/) {
        let amount = new web3.utils.toBN("0")
        let maker = new web3.utils.toBN("0")

        const userLowerCase = user.toLocaleLowerCase()
        const userCheckSum = web3.utils.toChecksumAddress(user)

        if(userLowerCase in claimJson["userData"]) continue

        if(bproJson["bpro"][userLowerCase]) {            
            amount = amount.add(bproJson["bpro"][userLowerCase]["total"])
            maker = maker.add(bproJson["bpro"][userLowerCase]["maker"])

            //console.log({amount}, bproJson["bpro"][user]["total"], amount.toString(10), amount.toString(16))
            //return
        }

        if(bproJson["bpro"][userCheckSum] && ((userCheckSum !== userLowerCase))) {            
            amount = amount.add(bproJson["bpro"][userCheckSum]["total"])
            maker = maker.add(bproJson["bpro"][userCheckSum]["maker"])

            //console.log({amount}, bproJson["bpro"][user]["total"], amount.toString(10), amount.toString(16))
            //return
        }        

        if(prevJson["userData"][userLowerCase]) {
            //console.log(prevJson["userData"][user]["amount"], prevJson["userData"][user]["maker"])
            amount = amount.add(new web3.utils.toBN(prevJson["userData"][userLowerCase]["amount"]))            
            maker = maker.add(new web3.utils.toBN(prevJson["userData"][userLowerCase]["makerAmount"]))
        }

        if(prevJson["userData"][userCheckSum] && (userCheckSum !== userLowerCase)) {
            //console.log(prevJson["userData"][user]["amount"], prevJson["userData"][user]["maker"])
            amount = amount.add(new web3.utils.toBN(prevJson["userData"][userCheckSum]["amount"]))            
            maker = maker.add(new web3.utils.toBN(prevJson["userData"][userCheckSum]["makerAmount"]))
        }        

        //const amount = "0x" + bproJson["bpro"][user]["total"]
        //const maker = "0x" + bproJson["bpro"][user]["maker"]
        //console.log(bproJson["bpro"])
        //console.log({amount})
        const input = [cycle, index, user, [BPROAddress], [amount.toString(10)]]
        //console.log({input})

        claimJson["userData"][userLowerCase] = {}
        claimJson["userData"][userLowerCase]["amount"] = "0x" + amount.toString(16)
        claimJson["userData"][userLowerCase]["makerAmount"] = "0x" + maker.toString(16)
        claimJson["userData"][userLowerCase]["cycle"] = cycle
        claimJson["userData"][userLowerCase]["index"] = index

        sum = sum.add(new web3.utils.toBN(amount))


        calls.push({address: rewardsDistributorAddress, abi: rewardsDistributorAbi, method: "encodeClaim", params : input})
        uniqueUsers.push(userLowerCase)

        index++
    }

    const result = await batch(calls, "latest")

    const elements = []
    const leaves = []
    for(const r of result) {
        //console.log(r[1])
        elements.push(r[0])
        leaves.push(r[1])
    }

    const merkleTree = new MerkleTree(elements, keccak256, { hashLeaves: true, sortPairs: true })
    const root = merkleTree.getHexRoot()
    claimJson["root"] = root
    claimJson["startBlock"] = bproJson["startBlock"]
    claimJson["endBlock"] = bproJson["endBlock"]
    claimJson["totalClaims"] = sum.toString()
    claimJson["rates"] = rates
    claimJson["cycle"] = cycle

    claimJson["sumDebt"] = bproJson["sumDebt"]
    claimJson["sumCollat"] = bproJson["sumCollat"]

    for(let i = 0 ; i < leaves.length ; i++) {
        const proof = merkleTree.getHexProof(leaves[i])
        const user = uniqueUsers[i]

        claimJson["userData"][user]["proof"] = proof
    }

    return claimJson
}

async function testClaims(jsonFileName) {
    const claimJson = (JSON.parse(fs.readFileSync(jsonFileName)))["userData"]
    const contract = new web3.eth.Contract(rewardsDistributorAbi, rewardsDistributorAddress)

    console.log(claimJson)

    for(const user in claimJson) {
        console.log("XXX",user)
        console.log(claimJson[user])
        const cycle = claimJson[user]["cycle"]
        const index = claimJson[user]["index"]
        const amount = claimJson[user]["amount"]
        const proof = claimJson[user]["proof"]

        console.log(cycle, index, amount, proof)

        const res = await contract.methods.isValidClaim(cycle, index, user, [BPROAddress], [amount], proof).call()
        assert(res, "invalid claim")
        if(! res) return
        console.log(index)
    }

}

module.exports.encodeClaims = encodeClaims
module.exports.testClaims = testClaims