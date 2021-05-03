const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs');
const axios = require('axios')
const assert = require('assert')
const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()

function verifyMerkleRoot(snaphotJson) {
    const BPROAddress = "0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"
    const elems = []
    for(const user in snaphotJson.userData) {
        const userInfo = snaphotJson.userData[user]
        const data = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'address', 'address[]', 'uint256[]'],
                                                   [userInfo.cycle, userInfo.index, user, [BPROAddress], [userInfo.amount]])
        elems.push(data)
    }

    const merkleTree = new MerkleTree(elems, keccak256, { hashLeaves: true, sortPairs: true })
    const root = merkleTree.getHexRoot()
    
    return root.toLowerCase() === snaphotJson.root.toLowerCase()
}

async function diff(ipfsHash, snapshotFileName) {
    const url = "https://cloudflare-ipfs.com/ipfs/" + ipfsHash
    console.log(url)
    const ipfsSnapshot = (await axios.get(url)).data
    const localSnapshot = JSON.parse(fs.readFileSync(snapshotFileName))

    const ipfsUsers = Object.keys(ipfsSnapshot.userData)
    const localUsers = Object.keys(localSnapshot.userData)

    assert.equal(ipfsUsers.length, localUsers.length, "user length missmatch")
    assert.deepEqual(ipfsUsers, localUsers, "user missmatch")

    const toBN = web3.utils.toBN
    const smallThreshold = toBN(100000000000000000) // 0.1 BPRO
    const tinyThreshold = toBN(10000000000000000) // 0.01 BPRO    

    for(const user of ipfsUsers) {
        const ipfsAmount = toBN(ipfsSnapshot.userData[user].amount)
        const localAmount = toBN(localSnapshot.userData[user].amount)

        if(ipfsAmount.lt(tinyThreshold) && localAmount.lt(tinyThreshold)) continue // diff does not matter

        let multiplier = toBN(1001)
        if(ipfsAmount.lt(smallThreshold) && localAmount.lt(smallThreshold)) multiplier = toBN(1200) // 20% diff

        assert(ipfsAmount.mul(multiplier).gt(localAmount.mul(toBN(1000))), "ifps amount too big " + user.toString())
        assert(localAmount.mul(multiplier).gt(ipfsAmount.mul(toBN(1000))), "local amount too big " + user.toString())
    }

    assert(verifyMerkleRoot(ipfsSnapshot), "ipfs root invalid")

    console.log("OK")
}

diff(process.argv[2],"./snapshot.json")