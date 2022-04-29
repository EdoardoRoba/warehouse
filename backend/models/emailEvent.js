const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const emailEventSchema = new Schema({
    events: {
        type: Array,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const EmailEvent = mongoose.model('EmailEvent', emailEventSchema)
module.exports = EmailEvent