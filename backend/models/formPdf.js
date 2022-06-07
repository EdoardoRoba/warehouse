const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const formPdfSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    form: {
        type: Array,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const FormPdf = mongoose.model('FormPdf', formPdfSchema)
module.exports = FormPdf