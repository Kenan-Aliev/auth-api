const {model,Schema,ObjectId} =require('mongoose')

const eventsSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    phone:{type:String,required:true},
    user:{type:ObjectId,ref:'newUsers'},
    city:{type:ObjectId,ref:'cities',required:true},
    type:{type:ObjectId,ref:'types',required:true},
    startDate:{type:String,required:true},
    address:{type:String,required:true}

})


module.exports = model('events',eventsSchema)