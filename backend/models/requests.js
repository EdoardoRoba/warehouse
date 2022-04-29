const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const requestSchema = new Schema({
    employee: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Request = mongoose.model('Request', requestSchema)
module.exports = Request