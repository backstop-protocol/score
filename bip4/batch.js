const multiCallAddress = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441"
const multiCallAbi = [{"constant":true,"inputs":[],"name":"getCurrentBlockTimestamp","outputs":[{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"name":"target","type":"address"},{"name":"callData","type":"bytes"}],"name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"name":"blockNumber","type":"uint256"},{"name":"returnData","type":"bytes[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLastBlockHash","outputs":[{"name":"blockHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getEthBalance","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentBlockDifficulty","outputs":[{"name":"difficulty","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentBlockGasLimit","outputs":[{"name":"gaslimit","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentBlockCoinbase","outputs":[{"name":"coinbase","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"blockNumber","type":"uint256"}],"name":"getBlockHash","outputs":[{"name":"blockHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]

const Web3Wrap = require('./web3Wrapper')
const web3 = Web3Wrap.getWeb3()

const {Contract} = web3.eth
const mCallContract = new Contract(multiCallAbi, multiCallAddress)

const batch = async (calls, blockNumber)=> {
    const batchCalls = calls.map(({abi, address, method, params}) => {
      const contract = new Contract(abi, address)
      const callData = contract.methods[method](...params).encodeABI()
      return {target: address, callData}
    })
    const results = await mCallContract.methods.aggregate(batchCalls).call({gasLimit:10e6}, blockNumber)        
    const decodedResults = results.returnData.map((result, index)=> {
      const {abi, method} = calls[index]
      const type = findType(abi, method)
      
      const res = web3.eth.abi.decodeParameters(type, result)
      if(res.__length__ == 1) return res[0]
      return res
    })
    return decodedResults
}
  
const findType = (abi, method)=> {
    const types = []
    for (let i=0; i< abi.length; i++){
      if(abi[i].name === method){
        for(output of abi[i].outputs) {
            types.push(output.type)
        }

        return types
        //return abi[i].outputs[0].type
      }
    }
}
  
module.exports = {
    batch
}