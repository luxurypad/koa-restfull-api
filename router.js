const uriHandler = require('./uriHandler')

//建立url和uri对应表
const matchList = [
  { pathRegExp: /^\/users$/, uri: 'users' },
  { pathRegExp: /^\/news$/, uri: 'news' },
  { pathRegExp: /^\/ssq$/, uri: 'ssq' },
  { pathRegExp: /^\/nav-tree$/, uri: 'navTree' },
  { pathRegExp: /.*/, uri: '' },
]

async function router(ctx, next) {
  //匹配到uri名称，通过参数赋值给处理器
  const uri = matchList.find((v, i, obj) => v.pathRegExp.test(ctx.path)).uri
  if (uri) {
    await uriHandler(ctx, next, uri)
  } else {
    ctx.body = {
      code: 404,
      msg: '无法找到相应资源',
      result: null
    }
  }
}
module.exports = router