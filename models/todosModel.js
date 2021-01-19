const {model,Schema,ObjectId} =require('mongoose')

const todosSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    date:{type:Date,default:Date.now()},
    user:{type:ObjectId,ref:'newUsers'}
})


module.exports = model('todos',todosSchema)