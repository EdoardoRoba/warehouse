const mongoose = require("../database");

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

//Image is a model which has a schema imageSchema

const ImageSchema = mongoose.model('ImageSchema', imageSchemaSchema)
module.exports = ImageSchema