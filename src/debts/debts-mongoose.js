const mongoose = require('mongoose');

const debtsSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    value: {
        type: String
    },
    note: {
        type: String
    },
    dueDate: {
        type: Date,
    },
    accountDate: {
        type: Date,
        default: Date.now
    },
}
)
module.exports = mongoose.model('debts', debtsSchema)