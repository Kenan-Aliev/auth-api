const {Schema, model} = require('mongoose')

const citiesSchema = new Schema({
    name: {type: String, required: true, unique: true}
})

module.exports = model('cities', citiesSchema)