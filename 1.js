// const dbPromise = require('./db')
const mongodb=require('mongodb')


// async function f(){
//   const db=await dbPromise
//   // const v=await db.collection('users').find({_id:new ObjectID('5d9e346b074d27773459bdd2')}).toArray()
//   const v=await db.collection('users').find({}).toArray()
//   // console.log(v)
//   // console.log(dir(v[0]._id) )
//   // console.log(new ObjectID('5d9e346b074d27773459bdd2').equals(new ObjectID('5d9e346b074d27773459bdd2'))
//   console.log(new ObjectID('5d9e346b074d27773459bdd2'))
//   console.log(new ObjectID('11111111111'))

// }
// f()
// console.log(new mongodb.ObjectId().toString())
let o={
  name:'鲁旭',
  age:11
}
// o._id='121212'
let o1={_id:'12121',...o}

console.log(o1)