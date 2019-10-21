## 1.请求数据格式
* 遵循RESTful规范，支持GET/PUT/POST/DELETE/PATCH
* 参数格式为json格式，GET/DELETE通过url，POST/PUT/PATCH通过request body
* 参数语法为
  * GET/DELETE `[{query},{options}]`
  * POST `[[{doc1},{doc2},{doc3}...],{options}]`
  * PUT/PATCH `[{filter},{update},{options}]`

## 2.返回值
```js
{
  code:Number, //状态码
  msg:String,  //响应消息
  method:String, //请求方法
  result:{     //响应结果
    n:Number  //数量
    nModified:Number //变化数量
    ok:1 || 0 //状态
  },
  data:[doc1,doc2,doc3,...] //响应返回数据
}
```
method| code|msg|method|result|data
-|-|-|-|-|-
GET|yes|yes|yes|{n,ok}|yes
POST|yes|yes|yes|{n,ok}|空数组
PUT|yes|yes|yes|{n,nModified,ok}|空数组
PATCH|yes|yes|yes|{n,nModified,ok}|空数组
DELETE|yes|yes|yes|{n,ok}|空数组
