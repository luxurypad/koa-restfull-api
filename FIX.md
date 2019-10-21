## 1.解决前后端路由冲突问题
由于前端路由采用的是BrowserRouter方式，因此需要后端路由配合，需要始终返回同一个index.html，路由交由前端处理
配置步骤
```js
//引入fs模块
const fs=require('fs')
//添加头信息
ctx.set('Content-Type', 'text/html;charset=utf-8')
//设置body内容
ctx.body = fs.readFileSync('public/inde1x.html', 'utf-8')
```
## 2.更新路由格式
```js
const matchList = [
  { pathRegExp: /^\/api\/users$/, uri: 'users' },
  { pathRegExp: /^\/api\/news$/, uri: 'news' },
  { pathRegExp: /^\/api\/trees$/, uri: 'trees' },
  { pathRegExp: /.*/, uri: '' },
]
```
## 3.添加压缩功能
```js
const compress=require('koa-compress')
app.use(compress())
```
## 4.添加SSL证书
```js
//引入库
const {default:enforceHttps}=require('koa-sslify')
const http=require('http')
const https=require('https')
const fs=require('fs')
//强制https，并指定端口
app.use(enforceHttps({port:6701}))
//启动https，配置http定向到https
  //添加配置
const options={
  key:fs.readFileSync('ssl/ssl.key'),
  cert:fs.readFileSync('ssl/ssl.pem')
}
  //start the server
http.createServer(app.callback()).listen(6700)
https.createServer(options,app.callback()).listen(6701)
```
## 5.将mongodb数据库的ObjectId插入时指定为字符串类型
```javascript
if (ctx.method === 'POST') {
  params=[...ctx.request.body]
  params[0]=params[0].map((v,i,array)=>({_id:new mongodb.ObjectId().toHexString(),...v}))
}
```