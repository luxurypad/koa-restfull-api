const dbPromise=require('../db')





module.exports=async (ctx,next)=>{

  //获取uri
  


  console.log(ctx.query.q)
  const db=await dbPromise
  ctx.body= await db.collection('us111er').find(JSON.parse(ctx.query.q || '{}')).toArray()
}

async function postAction(){

}
async function deleteAction(){

}
async function putAction(){

}
async function getAction(){

}
async function patchAction(){

}