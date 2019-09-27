const news = require('./uri/news')
const uriHandler = require('./uriHandler')

const matchList = [
  { pathRegExp: /^\/users$/, uri: 'users' },
  { pathRegExp: /^\/news$/, uri: 'news' },
  { pathRegExp: /^\/ssq$/, uri: 'ssq' },
  { pathRegExp: /.*/, uri: '' },
]

async function router(ctx, next) {
  const uri=matchList.find((v, i, obj) => v.pathRegExp.test(ctx.path)).uri
  const query=ctx.query
  const body=ctx.request.body
  const method=ctx.method
  if(uri){
    await uriHandler(ctx,next,uri,query,body,method)
  }else{
    ctx.body={
      code:404,
      msg:'无法找到相应资源',
      result:null
    }
  }
  // // await matchList.find((v, i, obj) => v.pathRegExp.test(ctx.path)).uri(ctx,next)
  // const dbName = matchList.find((v, i, obj) => v.pathRegExp.test(ctx.path)).uri
  // await handle(ctx, next, dbName)

}

module.exports = router