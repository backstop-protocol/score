const {batch} = require("./batch")
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs');

const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()

const { rewardsDistributorAbi } = require("./merkleEncodeAbi");
const assert = require("assert");
const rewardsDistributorAddress = "0x3fEf090ED8C8b1Ad29C9F745464dFeCE47053345"

const BPROAddress = "0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"

async function encodeClaims(bproJson, cycle, rates) {
    const calls = []
    let index = 0

    const claimJson = {"userData" :{}}
    const users = []

    let sum = new web3.utils.toBN("0")

    for(const user in bproJson["bpro"]) {
        const amount = "0x" + bproJson["bpro"][user]["total"]
        const maker = "0x" + bproJson["bpro"][user]["maker"]
        //console.log(bproJson["bpro"])
        //console.log({amount})
        const input = [cycle, index, user, [BPROAddress], [amount]]
        //console.log({input})

        claimJson["userData"][user] = {}
        claimJson["userData"][user]["amount"] = amount
        claimJson["userData"][user]["makerAmount"] = maker        
        claimJson["userData"][user]["cycle"] = cycle
        claimJson["userData"][user]["index"] = index

        sum = sum.add(new web3.utils.toBN(amount))


        calls.push({address: rewardsDistributorAddress, abi: rewardsDistributorAbi, method: "encodeClaim", params : input})
        users.push(user)

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

    for(let i = 0 ; i < leaves.length ; i++) {
        const proof = merkleTree.getHexProof(leaves[i])
        const user = users[i]

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