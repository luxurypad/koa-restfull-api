const Koa = require('koa')
const static = require('koa-static')
const koaBody = require('koa-body')
const compress = require('koa-compress')
const { default: enforceHttps } = require('koa-sslify')
const http = require('http')
const https = require('https')
const fs = require('fs')

const useToken = require('./token')
const router = require('./router')

const app = new Koa()

//强制配置https
// app.use(enforceHttps({port:6701}))

app.use(compress())
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

//处理OPTIONS请求
app.use(async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200
  } else {
    await next()
  }
})

//处理路由
app.use(router)

//证书配置
const options = {
  key: fs.readFileSync('ssl/ssl.key'),
  cert: fs.readFileSync('ssl/ssl.pem')
}

//启动http服务
http.createServer(app.callback()).listen(6700)
console.log('http-server is running on 6700')
//启动https服务
https.createServer(options, app.callback()).listen(6701)
console.log('https-server is running on 6701')