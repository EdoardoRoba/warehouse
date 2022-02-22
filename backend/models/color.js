const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const colorStatusSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const ColorStatus = mongoose.model('ColorStatus', colorStatusSchema)
module.exports = ColorStatus