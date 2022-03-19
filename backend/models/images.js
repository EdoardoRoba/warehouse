const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const imagesSchema = new Schema({
    customer: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Images = mongoose.model('Images', imagesSchema)
module.exports = Images