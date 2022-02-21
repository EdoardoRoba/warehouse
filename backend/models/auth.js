const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const authSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    permissions: {
        type: String,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Auth = mongoose.model('Auth', authSchema)
module.exports = Auth