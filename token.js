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
    
    // console.log(ctx.body)
    if (ctx.path === '/users' && ctx.body) {
      if (ctx.body.result.length===1){
       ctx.body.result[0].token = create({ username: ctx.body.result[0].username })
      }
    }

  } else {
    if (check(ctx.header.authorization)) {
      await next() //如果token校验返回值为真，则通过
    } else {        //如果token校验返回为假，则返回无效token数据
      ctx.body = {
        code: 400,
        msg: '无效token',
        data: {}
      }
    }
  }
}

module.exports = useToken