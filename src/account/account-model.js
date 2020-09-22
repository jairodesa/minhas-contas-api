const accountMongoose = require("./account-mongoose");
const User = require("../user/index").model;
const { InternalServerError, InvalidArgumentError } = require('../utils/error');
const objectId = require("../database/configdb").connection.objectId;

module.exports = {
    Account: {
        async add(account) {
            try {
                const user = await User.findByEmail(account.accountEmail);
                const newAccount = new accountMongoose({
                    accountId: user._id,
                    accountEmail: user.userEmail,
                    castMonth: account.castMonth,
                    accountYear: account.accountYear,
                    debts: account.debts
                })
                newAccount.save()
                return newAccount
            } catch (error) {
                throw new InternalServerError('Error adding account!' + error);
            }
        },
        async listById(accountid) {
            let query = accountMongoose.where({ accountId: accountid });
            return await query.findOne((error, account) => {
                if (error) throw new InternalServerError(`error by accountId ${error}`);
                return account
            });
        },
        async findById(accountid, iditem) {
            let query = accountMongoose.where({ accountId: accountid });
            const account = await query.findOne((error, account) => {
                if (error) throw new InternalServerError(`error add account: ${error}`);
            });
            const lsitAccount = account.debts.map(account => account)
            return lsitAccount.find((ls) => ls._id == iditem)

        },
        async update(id, iditem, accountObj) {
            let query = accountMongoose.where({ _id: objectId(id) });

            return query.findOne((error, account) => {
                if (error) throw new InternalServerError(`error add account: ${error}`);
                const lsitAccount = account.debts.map(account => account)

                const lista = lsitAccount.map((list, index) => {
                    if (list._id == iditem) {
                        list.listDebts.push(accountObj)
                    }
                })
                account.save()
            });
        },
        async delete(id, iditem) {
            let query = accountMongoose.where({ _id: objectId(id) });

            if (iditem == undefined) {
                return await query.deleteOne((err, account) => {
                    if (err) throw new InternalServerError(err);
                });
            }
            return query.findOne((error, account) => {
                if (error) throw new InternalServerError(`error by accountId ${error}`);
                const lsitAccount = account.debts.map(account => account.listDebts)
                const list = lsitAccount.map((list) => {
                    list.pull(objectId(iditem))
                })
                account.save()
            });
        }

    }
}