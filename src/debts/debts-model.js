const debtsMongoose = require("./debts-mongoose");

const objectId = require("../database/configdb").connection.objectId;

module.exports = {
    debts: {
        async add(debt) {
            try {

                const newAccount = new debtsMongoose({
                    accountId: debt.accountId,
                    dueDate: debt.dueDate,
                    name: debt.name,
                    note: debt.note,
                    value: debt.value

                })
                await newAccount.save()
                return newAccount
            } catch (error) {
                console.log(error)
                throw new InternalServerError('Error adding debts!' + error);

            }
        },
        async listById(accountId) {
            console.log(accountId)
            let query = debtsMongoose.where({ accountId: accountId });
            return await query.find((error, debts) => {
                if (error) throw new InternalServerError(`error by accountId ${error}`);

                return debts
            });
        },
        async update(id, accountObj) {
            return await debtsMongoose.updateOne({ _id: objectId(id) }, accountObj, function (error, res) {
                if (error) throw new InternalServerError(`error alter debts: ${error}`);
                return res
            });
        },
        async delete(id) {
            return await debtsMongoose.deleteOne({ _id: objectId(id) }, function (error) {
                if (error) throw new InternalServerError(`error alter debts: ${error}`);
            });
        }
    }
}