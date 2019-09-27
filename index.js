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
  // console.log(ctx.request.body)
  // console.log(ctx.body)
  // // console.log(ctx.request)
  await next()
  
})

app.use(router)

// app.use(async (ctx,next)=>{
//   router.find((v,i,obj)=>v.path===ctx.path).uri(ctx,next)

//   await next()
// })
// app.use(async (ctx,next)=>{
//   await next()
// })
// app.use(async (ctx,next)=>{
// //  console.log(ctx.path) 
// //  console.log(ctx.url) 
//   await next()
// })


// app.use(async (ctx, next) => {

//   const path=ctx.url.split('/')[1]

//   switch (path) {
//     case 'news':
//       console.log('luxu')
//       await news(ctx,next)
//       console.log(ctx.body,111)
//       // console.log('news')
//       // app.use(news)
//       // ctx.body= await news
//       // console.log(ctx.header)
//       break;
//     case 'login':
//       ctx.body=token.create({name:'鲁旭'})
//       break;
//     default:
//       ctx.body=404
//       break;
//   }



// })




// app.use(async(ctx,next)=>{
//   ctx.body='首页'
//   console.log('11')
//   await next()
// })



app.listen(4000)
console.log('app start on 4000')

