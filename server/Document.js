const { Schema, model } = require('mongoose');

const Document = new Schema({
    _id: String,
    data: Object,
    name: String,
    owner: String,
})

module.exports = model("Document", Document);