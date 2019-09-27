const MongoClient = require('mongodb').MongoClient
const url = "mongodb://luxu.site:27017"
const dbName = 'koa'

module.exports=MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((client)=>{
    console.log(url + ' 连接成功' + ' 数据库：' + dbName)
    return client.db(dbName)
  }).catch((err)=>{console.log(err.name)})
