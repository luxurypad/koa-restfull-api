const db= require('./db')
const mongodb = require('mongodb')

const connectionPromise=db('mongodb://luxu.site:27017')

async function uriHandler(ctx, next, uri) {
  const connection=await connectionPromise
  //得到对应集合
  const collection = connection('koa').collection(uri)
  //调和请求参数
  let params = []
  if (ctx.method === 'GET' || ctx.method === 'DELETE') {
    params = JSON.parse(ctx.query.q || '[]')
  } else if (ctx.method === 'POST') {
    params=[...ctx.request.body]
    params[0]=params[0].map((v,i,array)=>({_id:new mongodb.ObjectId().toHexString(),...v}))
  }else if (ctx.method === 'PUT' || ctx.method === 'PATCH') {
    params = ctx.request.body
  }

  switch (ctx.method) {
    case 'GET':
      await getHandle(ctx, next, collection, params)
      break;
    case 'POST':
      await postHandle(ctx, next, collection, params)
      break;
    case 'DELETE':
      await deleteHandle(ctx, next, collection, params)
      break;
    case 'PUT':
      await putHandle(ctx, next, collection, params)
      break;
    case 'PATCH':
      await patchHandle(ctx, next, collection, params)
      break;
    default:
      break;
  }
}

//GET
async function getHandle(ctx, next, collection, params) {
  const result = await collection.find(...params).toArray()
  ctx.body = {
    code: 200,
    msg: '查询成功',
    method: 'GET',
    result: { ok: 1, n: result.length },
    data: result
  }
}
//POST
async function postHandle(ctx, next, collection, params) {
  const result = await collection.insertMany(...params).catch((error) => { console.log(error) })
  ctx.body = (result ? { code: 200, msg: 'success', method: 'POST', result: result.result, data: [] } : { code: 400, msg: '语法错误', method: 'POST', result: { ok: 0 }, data: [] })
}
//DELETE
async function deleteHandle(ctx, next, collection, params) {
  const result = await collection.deleteMany(...params)
  ctx.body = (result.result.n >= 1 ? { code: 200, msg: '删除成功', method: 'DELETE', result: result.result, data: [] } : { code: 200, msg: '删除失败', method: 'DELETE', result: result.result, data: [] })
}

//PUT 
//循环执行replaceOne实现批量替换
async function putHandle(ctx, next, collection, params) {
  //拿到过滤结果=>结果对象数组()
  const result = await collection.find(params[0]).toArray()
  //得到promise结果数组
  const promises = result.map((v, i, array) => {
    //通过唯一ObjectID过滤唯一文档，再执行替换
    return collection.replaceOne({ _id: v._id }, params[1]).catch((error) => { console.log(error) })
  })
  //得到最终结果数组
  const results = await Promise.all(promises)

  if (results.some((v, i, a) => typeof v === 'undefined')) {
    ctx.body = { code: 400, msg: '语法错误', method: 'PUT', result: { ok: 0 }, data: [] }
    return
  }
  //累加返回结果值
  //设置初始值
  const value = { n: 0, nModified: 0, ok: 1 }
  results.forEach((v, i, array) => {
    value.n += v.result.n
    value.nModified += v.result.nModified
    value.ok *= v.result.ok
  })
  //返回结果给客户端
  ctx.body = { code: 200, msg: '替换完成', method: 'PUT', result: value, data: [] }
}

//PATCH
async function patchHandle(ctx, next, collection, params) {
  const result = await collection.updateMany(...params)
  ctx.body = (result.result.n >= 1 ? { code: 200, msg: '更新成功', method: 'PATCH', result: result.result, data: [] } : { code: 200, msg: '更新失败', method: 'PATCH', result: result.result, data: [] })
}

module.exports = uriHandler