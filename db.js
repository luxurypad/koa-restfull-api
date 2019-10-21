const MongoClient = require('mongodb').MongoClient

async function db(url){
  const connection = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }).catch((error) => { console.log(error.name) })
  console.log(url,'连接成功')
  return function(dbName){
    return connection.db(dbName)
  }
}

module.exports=db


// async function dbConnect(url){
//   const connection = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }).catch((error) => { console.log(error.name) })
//   console.log(url,'连接成功')
//   return connection
// }

// async function db(dbName){
//   const connection= await dbConnect('mongodb://luxu.site:27017')
//   return connection.db(dbName)
// }
