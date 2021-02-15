const {Schema, model} = require("mongoose")

const typeSchema = new Schema({
    name: {type: String, required: true, unique: true}
})

module.exports = model('types', typeSchema)