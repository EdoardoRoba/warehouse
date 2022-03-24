const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const customerSchema = new Schema({
    company: {
        type: String,
        required: false
    },
    nome_cognome: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: false
    },
    indirizzo: {
        type: String,
        required: false
    },
    comune: {
        type: String,
        required: false
    },
    provincia: {
        type: String,
        required: false
    },
    bonus: {
        type: String,
        required: false
    },
    termico_elettrico: {
        type: String,
        required: false
    },
    computo: {
        type: String,
        required: false
    },
    data_sopralluogo: {
        type: String,
        required: false
    },
    foto_sopralluogo: {
        type: Array,
        required: false
    },
    pdf_sopralluogo: {
        type: Array,
        required: false
    },
    data_installazione: {
        type: String,
        required: false
    },
    foto_fine_installazione: {
        type: Array,
        required: false
    },
    installatore: {
        type: String,
        required: false
    },
    tecnico: {
        type: String,
        required: false
    },
    trasferta: {
        type: String,
        required: false
    },
    di_co: {
        type: Array,
        required: false
    },
    check_list: {
        type: Array,
        required: false
    },
    fgas: {
        type: Array,
        required: false
    },
    prova_fumi: {
        type: Array,
        required: false
    },
    collaudo: {
        type: Array,
        required: false
    },
    isAssisted: {
        type: Boolean,
        required: false
    },
    assistenza: {
        type: Array,
        required: false
    },
    foto_assistenza: {
        type: Array,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    pagamenti_pdf: {
        type: Array,
        required: false
    },
    pagamenti_testo: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer