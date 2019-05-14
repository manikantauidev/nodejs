const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Issue = new Schema({
    title: String,
    responsible: {
        type: String
    },
    description: {
        type: String
    },
    severity: {
        type: String
    },
    status: {
        type: String,
        default: 'Open'
    }
});

module.exports =  mongoose.model('IssueModel', Issue);