const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const profileSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Profile = mongoose.model('Profile', profileSchema)
module.exports = Profile