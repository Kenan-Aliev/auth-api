const {model, Schema, ObjectId} = require('mongoose')

const eventsSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    phone: {type: String, required: true},
    user: {type: ObjectId, ref: 'newUsers'},
    photos:[{type:String,required:true}],
    city: {type: String, required: true},
    type: {type: String, required: true},
    date: {type: String, required: true},
    address: {type: String, required: true},
    views:{type:Number,default:0},
    likes:{type:Number,default:0},
    userEmail:{type:String}
})


module.exports = model('events', eventsSchema)