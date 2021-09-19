'use strict';
const { work } = require("./worker")
const bip1 = require("./bip1")
const { uploadScoreFile, uploadJsonFile } = require("./s3-client.js")

module.exports.calcScore = async (event) => {
  try{
    const jsonRes = await work()
    console.log(jsonRes)
    const success = await uploadJsonFile(jsonRes, "bip4.json")
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  }catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: `${e.message} @: ${e.stack} `,
          input: event,
        },
        null,
        2
      ),
    };
  }
  
};
module.exports.bip1 = async (event) => {
  try{
    const jsonRes = await bip1.getResults()
    console.log(jsonRes)
    const success = await uploadJsonFile(jsonRes, "bip1.json")
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  }catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: `${e.message} @: ${e.stack} `,
          input: event,
        },
        null,
        2
      ),
    };
  }
};
