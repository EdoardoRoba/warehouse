const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const customerSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    nome_cognome: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    indirizzo: {
        type: String,
        required: true
    },
    comune: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    bonus: {
        type: String,
        required: true
    },
    termico_elettrico: {
        type: String,
        required: true
    },
    computo: {
        type: String,
        required: true
    },
    data_sopralluogo: {
        type: String,
        required: false
    },
    foto_sopralluogo: {
        type: String,
        required: false
    },
    data_installazione: {
        type: String,
        required: false
    },
    foto_fine_installazione: {
        type: String,
        required: false
    },
    installatore: {
        type: String,
        required: false
    },
    trasferta: {
        type: String,
        required: false
    },
    di_co: {
        type: String,
        required: false
    },
    check_list: {
        type: String,
        required: false
    },
    fgas: {
        type: String,
        required: false
    },
    prova_fumi: {
        type: String,
        required: false
    },
    collaudo: {
        type: String,
        required: false
    },
    assistenza: {
        type: String,
        required: false
    },
    foto_assistenza: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    pagamenti_pdf: {
        type: String,
        required: false
    },
    pagamenti_testo: {
        type: String,
        required: false
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer