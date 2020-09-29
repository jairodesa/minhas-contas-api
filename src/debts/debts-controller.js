const { debts } = require('./debts-model');
module.exports = {
    async add(req, res) {
        const debt = req.body;
        try {
            const newDebts = await debts.add(debt);
            res.status(201).json(newDebts);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    },
    async findById(req, res) {
        try {
            const debtsList = await debts.listById(req.params.accountId);
            res.status(200).json(debtsList);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        const debt = req.body
        try {
            await debts.update(req.params.accountid, debt);
            res.status(200).json();
        } catch (erro) {
            res.status(500).json({ erro: erro });
        }
    },
    async delete(req, res) {
        try {
            await debts.delete(req.params.accountid);
            res.status(200).json();
        } catch (erro) {
            res.status(500).json({ erro: erro });
        }
    },
}