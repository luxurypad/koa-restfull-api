const dbPromise = require('./db')
const ObjectId = require('mongodb').ObjectId

const handleList = [
  { method: 'POST', handler: postHandle },
  { method: 'DELETE', handler: deleteHandle },
  { method: 'PUT', handler: putHandle },
  { method: 'GET', handler: getHandle },
  { method: 'PATCH', handler: patchHandle }
]

async function uriHandler(ctx, next, uri, query, body, method) {
  const db = await dbPromise
  const collection = db.collection(uri)
  await handleList.find((v, i, obj) => v.method === method).handler(ctx, next, collection, query, body)
}

//GET
async function getHandle(ctx, next, collection, query, body) {
  const result = await collection.find(...JSON.parse(query.g || '[{"":""}]')).toArray()
  ctx.body = {
    code: 200,
    msg: '查询成功',
    result: result
  }
}
//POST
async function postHandle(ctx, next, collection, query, body) {
  const result = await collection.insertMany(...body)
  // const result = await (Array.isArray(body) ? collection.insertMany(body) : collection.insertOne(body))
  ctx.body = (result.result.n >= 1 ? { code: 200, msg: '新增成功', result: result.result } : { code: 200, msg: '新增失败', result: result.result })
}
//DELETE
async function deleteHandle(ctx, next, collection, query, body) {
  const result = await collection.deleteMany(...JSON.parse(query.d || '[{"":""}]'))
  ctx.body = (result.result.n >= 1 ? { code: 200, msg: '删除成功', result: result.result } : { code: 200, msg: '删除失败', result: result.result })
}
//PUT 循环执行replaceOne实现批量替换
async function putHandle(ctx, next, collection, query, body) {
  //拿到过滤结果=>结果对象数组()
  const result = await collection.find(body[0]).toArray()
  //得到promise结果数组
  const promises = result.map((v, i, array) => {
      //通过唯一ObjectID过滤唯一文档，再执行替换
    return collection.replaceOne({ _id: v._id }, body[1])
  })
  //得到最终结果数组
  const results = await Promise.all(promises)
  //累加返回结果值
      //设置初始值
  const value = { n: 0, nModified: 0, ok: 1 }

  results.forEach((v, i, array) => {
    value.n += v.result.n
    value.nModified += v.result.nModified
    value.ok *= v.result.ok
  })

  //返回结果给客户端
  ctx.body={code:200,msg:'替换完成',result:value}
}
async function patchHandle(ctx, next, collection, query, body) {
  const result = await collection.updateMany(...body)
  ctx.body = (result.result.n >= 1 ? { code: 200, msg: '更新成功', result: result.result } : { code: 200, msg: '更新失败', result: result.result })
}


module.exports = uriHandler