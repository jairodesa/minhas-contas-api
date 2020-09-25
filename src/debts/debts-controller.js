const { debts } = require('./debts-mongoose');
module.exports = {
    async add(req, res) {

        const debt = req.body;
        console.log(debt)
        try {
            const debts = await debts.add(debt);
            res.status(201).json(debt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async findById(req, res) {
        try {
            const debtsList = await debts.listById(req.params.accountid);
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