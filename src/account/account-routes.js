const accountController = require('./account-controller')
const middlewaresAuthentication = require('../user/middlewares-authentication');

module.exports = app => {
    app
        .route('/api/account')
        .post(middlewaresAuthentication.bearer, accountController.add)
    app
        .route('/api/account/:accountid')
        .get(middlewaresAuthentication.bearer, accountController.list)
        .get(middlewaresAuthentication.bearer, accountController.findById);
    app
        .route('/api/account/findById/:accountid/:iditem')
        .get(middlewaresAuthentication.bearer, accountController.findById);
    app
        .route('/api/account')
        .put(middlewaresAuthentication.bearer, accountController.update);
    app
        .route('/api/account')
        .delete(middlewaresAuthentication.bearer, accountController.delete);
}