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
    cap: {
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
    cf: {
        type: String,
        required: false
    },
    pdf_computo: {
        type: Array,
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
    data_assistenza: {
        type: String,
        required: false
    },
    foto_fine_installazione: {
        type: Array,
        required: false
    },
    tecnico_installazione: {
        type: String,
        required: false
    },
    tecnico_sopralluogo: {
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
    isArgo: {
        type: Boolean,
        required: false
    },
    isBuildAutomation: {
        type: Boolean,
        required: false
    },
    tecnico_argo: {
        type: String,
        required: false
    },
    tecnico_buildAutomation: {
        type: String,
        required: false
    },
    data_argo: {
        type: String,
        required: false
    },
    data_buildAutomation: {
        type: String,
        required: false
    },
    foto_argo: {
        type: Array,
        required: false
    },
    foto_buildAutomation: {
        type: Array,
        required: false
    },
    assistenza: {
        type: Array,
        required: false
    },
    tecnico_assistenza: {
        type: String,
        required: false
    },
    foto_assistenza: {
        type: Array,
        required: false
    },
    note_info: {
        type: String,
        required: false
    },
    note_sopralluogo: {
        type: String,
        required: false
    },
    note_installazione: {
        type: String,
        required: false
    },
    note_assistenza: {
        type: String,
        required: false
    },
    note_argo: {
        type: String,
        required: false
    },
    note_buildAutomation: {
        type: String,
        required: false
    },
    note_pagamenti: {
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
    },
    argo_pdf: {
        type: Array,
        required: false
    },
    buildAutomation_pdf: {
        type: Array,
        required: false
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer