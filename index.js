const Koa = require('koa')
const static = require('koa-static')
const koaBody=require('koa-body')
const useToken=require('./token')
const router=require('./router')

const app = new Koa()

app.use(koaBody())
app.use(useToken)
app.use(static('./public'))

//测试中间件
app.use(async(ctx,next)=>{
  await next()
})

app.use(router)

app.listen(4000)
console.log('app start on 4000')

