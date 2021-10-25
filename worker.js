const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()
const axios = require('axios')
const fs = require('fs')

const { rewardsDistributorAbi } = require("./merkleEncodeAbi")
const rewardsDistributorAddress = "0x3fEf090ED8C8b1Ad29C9F745464dFeCE47053345"

/*
async function getLastEndBlock() {
    const contract = new web3.eth.Contract(rewardsDistributorAbi, rewardsDistributorAddress)
    const merkleData = await contract.methods.getMerkleData().call()

    const ipfsHash = merkleData[2]
    const url = "https://cloudflare-ipfs.com/ipfs/" + ipfsHash
    const json = await axios.get(url)
    return json.data.endBlock
}*/

async function getLastJson() {
    const contract = new web3.eth.Contract(rewardsDistributorAbi, rewardsDistributorAddress)
    const merkleData = await contract.methods.getMerkleData().call()

    const ipfsHash = "bafybeidx42il57rd35trgl65l5jn7f2azlmdak2xcgah6ytrvoudyvnwsu" //merkleData[2]
    const url = "https://cloudflare-ipfs.com/ipfs/" + ipfsHash
    console.log(url)
    const json = await axios.get(url)
    //console.log(json.data)
    return json.data
    //return JSON.parse(json.data)
}

async function work(lastBlock) {
    let endBlock = lastBlock || Number(await web3.eth.getBlockNumber() - 20)

    const lastJson = await getLastJson()
    const startBlock = Number(lastJson.endBlock) + 1

    console.log(startBlock, endBlock)

    const Main = require("./main")
    const res = await Main.main(startBlock, endBlock, lastJson)

    console.log("print")
    if(!process.env.SERVERLESS) fs.writeFileSync('./snapshot.json', JSON.stringify(JSON.parse(res), null, 2) , 'utf-8')
    
    return res
}


async function workAllNight() {
    await work()

    console.log("waiting for 10 minutes")
    // run every 30 minutes
    setTimeout(workAllNight, 1000 * 60 * 10)
}

module.exports = {
    work
}