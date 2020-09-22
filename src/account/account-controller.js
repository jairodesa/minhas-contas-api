const { Account } = require('./account-model');
const { InvalidArgumentError } = require('../utils/error');

module.exports = {
    async add(req, res) {

        const accountObject = req.body;
        try {
            const account = await Account.add(accountObject);

            res.status(201).json(Account);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async list(req, res) {
        try {
            const accountList = await Account.listById(req.params.accountid);
            res.status(200).json(accountList);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async findById(req, res) {
        try {
            const { accountid, iditem } = req.params
            const accountList = await Account.findById(accountid, iditem);
            res.status(200).json(accountList);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async update(req, res) {
        const { id, iditem } = req.query
        const accountReq = req.body

        try {
            await Account.update(id, iditem, accountReq);
            res.status(200).json();
        } catch (erro) {
            res.status(500).json({ erro: erro });
        }
    },
    async delete(req, res) {
        const { id, iditem } = req.query

        try {
            await Account.delete(id, iditem);
            res.status(200).json();
        } catch (erro) {
            res.status(500).json({ erro: erro });
        }
    },
}