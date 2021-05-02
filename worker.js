const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()
const axios = require('axios')

const { rewardsDistributorAbi } = require("./merkleEncodeAbi")
const rewardsDistributorAddress = "0x3fEf090ED8C8b1Ad29C9F745464dFeCE47053345"


async function getLastEndBlock() {
    const contract = new web3.eth.Contract(rewardsDistributorAbi, rewardsDistributorAddress)
    const merkleData = await contract.methods.getMerkleData().call()

    const ipfsHash = merkleData[2]
    const url = "https://cloudflare-ipfs.com/ipfs/" + ipfsHash
    const json = await axios.get(url)
    return json.data.endBlock
}

async function work() {
    const startBlock = await getLastEndBlock() + 1
    const currBlock = await web3.eth.getBlockNumber() - 10

    console.log(startBlock, currBlock)

    const Main = require("./main")
    const res = await Main.main(startBlock, currBlock)
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