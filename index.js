const Koa = require('koa')
const static = require('koa-static')
const koaBody = require('koa-body')
const useToken = require('./token')
const router = require('./router')

const app = new Koa()

app.use(koaBody())
app.use(useToken)
app.use(static('./public'))

//跨域配置
app.use(async (ctx, next) => {
  await next()
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization")
  ctx.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE,PATCH")
})

app.use(router)

app.listen(4000)
console.log('app start on 4000')

