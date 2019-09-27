const jwt = require('jsonwebtoken')

const token = {
  secret: 'luxu',     //定义服务器密钥
  expiresIn: 300,     //定义过期时间
  whiteList: [        //定义白名单
    { url: '/login', method: 'GET' },
    { url: '/user', method: 'GET' },
    { url: '/admin', method: '*' },
    { url: '*', method: '*' },
  ],

  create(payload) {   //定义create方法
    console.log(this)
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
  },
  check(token) {      //定义校验方法
    try {
      return jwt.verify(token, this.secret)
    } catch (error) {
      console.log(error.name)
      return false
    }
  },
  async useToken(ctx, next) {   //定义中间件方法
    //校验否白名单（注意不能用this调用，调用时this指向全局)
    const isWhiteList = token.whiteList.some((v, i, a) => {
      return (ctx.url === v.url || v.url === '*') && (ctx.method === v.method || v.method === '*')
    })

    if (isWhiteList) {
      await next() //如果是白名单请求，直接通过
    } else {
      if (token.check(ctx.header.authorization)) {
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
}

module.exports = token