const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const toolSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    subDepartment: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    lowerBound: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    lastUser: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: false
    },
    marca: {
        type: String,
        required: false
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Tool = mongoose.model('Tool', toolSchema)
module.exports = Tool