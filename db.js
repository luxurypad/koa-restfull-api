const MongoClient = require('mongodb').MongoClient
const dbConfig=require('./dbConfig.json')

//对象解构赋值，添加初始值
const {url='mongodb://127.0.0.1:12345',dbName='test'}=dbConfig

async function db() {
  const mongoclient = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }).catch((error) => { console.log(error.name) })
  console.log(url + ' 连接成功' + ' 数据库：' + dbName)
  return mongoclient.db(dbName)
}

module.exports=db()