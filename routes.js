const users = require('./src/user');
const account = require('./src/account');

module.exports = app => {
    users.routes(app);

    account.routes(app);
};