const users = require('./src/user');
const account = require('./src/account');
const debts = require('./src/debts');

module.exports = app => {
    users.routes(app);
    debts.routes(app)
    account.routes(app);

};