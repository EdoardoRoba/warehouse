const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const employeeSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birth: {
        type: String,
        required: false
    },
    fiscalCode: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Employee = mongoose.model('Employee', employeeSchema)
module.exports = Employee