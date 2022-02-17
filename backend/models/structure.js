const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const structureSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    father: {
        type: String,
        required: false
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Structure = mongoose.model('Structure', structureSchema)
module.exports = Structure