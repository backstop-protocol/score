const { work } = require("./worker")

console.log(process.argv[2])

work(process.argv[2])