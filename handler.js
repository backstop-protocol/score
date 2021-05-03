'use strict';
const { work } = require("./worker")
const { uploadScoreFile } = require("./s3-client.js")

module.exports.calcScore = async (event) => {
  try{
    const jsonRes = await work()
    console.log(jsonRes)
    const success = await uploadScoreFile(jsonRes)
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
  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
