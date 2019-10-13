const uriHandler = require('./uriHandler')
const fs = require('fs')

//建立url和uri对应表
const matchList = [
  { pathRegExp: /^\/api\/users$/, uri: 'users' },
  { pathRegExp: /^\/api\/news$/, uri: 'news' },
  { pathRegExp: /^\/api\/trees$/, uri: 'trees' },
  { pathRegExp: /.*/, uri: '' },
]

async function router(ctx, next) {
  //匹配到uri名称，通过参数赋值给处理器
  const uri = matchList.find((v, i, obj) => v.pathRegExp.test(ctx.path)).uri
  if (uri) {
    await uriHandler(ctx, next, uri)
  } else {
    //匹配不到则返回index.html
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = fs.readFileSync('public/index.html', 'utf-8')
  }
}
module.exports = router