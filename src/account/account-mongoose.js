const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: false
    },
    accountEmail: {
        type: String,
        required: true
    },
    accountDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    accountAlter: {
        type: Date,
        required: true,
        default: Date.now
    },
    accountYear: {
        type: String,
        required: true
    },
    castMonth: {
        type: String,
        required: false
    },
    debts: [{
        mounth: {
            type: String
        },
        amountNumber: {
            type: Number
        },
        amount: {
            type: String
        },
        listDebts: [{
            name: {
                type: String
            },
            value: {
                type: String
            },
            note: {
                type: String
            },
            accountDate: {
                type: Date,
                default: Date.now
            },
        }]
    }]
})
module.exports = mongoose.model('account', accountSchema)