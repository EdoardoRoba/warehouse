const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const registerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Register = mongoose.model('Register', registerSchema)
module.exports = Register