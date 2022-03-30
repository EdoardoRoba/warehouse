const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const calendarSchema = new Schema({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    employees: {
        type: Array,
        required: true
    },
    customer: {
        type: Object,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Calendar = mongoose.model('Calendar', calendarSchema)
module.exports = Calendar