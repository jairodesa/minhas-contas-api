const debtsController = require('./debts-controller')
const middlewaresAuthentication = require('../user/middlewares-authentication');

module.exports = app => {
    app
        .route('/api/debts')
        .post(middlewaresAuthentication.bearer, debtsController.add)
    app
        .route('/api/debts/:accountId')
        .get(middlewaresAuthentication.bearer, debtsController.findById);
    app
        .route('/api/debts')
        .put(middlewaresAuthentication.bearer, debtsController.update);
    app
        .route('/api/debts')
        .delete(middlewaresAuthentication.bearer, debtsController.delete);
}