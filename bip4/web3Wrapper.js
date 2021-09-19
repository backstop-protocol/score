const Web3 = require('web3')
const url = process.env.NODE_URL
const web3 = new Web3(url);

function getWeb3() {
    return web3
}


module.exports.getWeb3 = getWeb3