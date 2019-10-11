const jwt = require('jsonwebtoken')

const secret = 'luxu'
const expiresIn = 300
const whiteList = [
  { url: '/login', method: 'GET' },
  { url: '/user', method: 'GET' },
  { url: '/admin', method: '*' },
  { url: '*', method: '*' }
]
//定义create方法
function create(payload) {
  return jwt.sign(payload, secret, { expiresIn: expiresIn })
}
//定义校验方法
function check(token) {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    console.log(error.name)
    return false
  }
}
async function useToken(ctx, next) {   //定义中间件方法
  //校验否白名单
  const isWhiteList = whiteList.some((v, i, a) => {
    return (ctx.url === v.url || v.url === '*') && (ctx.method === v.method || v.method === '*')
  })

  if (isWhiteList) {

    await next() //如果是白名单请求，直接通过

    //洋葱模型 返回时,判断登陆请求
    if (ctx.path === '/users' && ctx.body.method === 'GET') {
      //判断是否登陆请求
      const { username, password } = JSON.parse(ctx.query.g)[0]
      if (!!username && !!password && ctx.body.result.n === 1) {
        ctx.body.data[0].token = create({ username: ctx.body.data[0].username })
      }
    }

  } else {
    if (check(ctx.header.authorization)) {
      await next() //如果token校验返回值为真，则通过
    } else {        //如果token校验返回为假，则返回无效token数据
      ctx.body = {
        code: 400,
        msg: '无效token',
        result: { ok: 0 },
        data: []
      }
    }
  }
}

module.exports = useToken