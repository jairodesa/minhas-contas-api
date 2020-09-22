const usersController = require('./users-controller')

const middlewaresAuthentication = require('./middlewares-authentication');

module.exports = app => {
    app
        .route('/user/update_token')
        .post(middlewaresAuthentication.refresh, usersController.login);

    app
        .route('/user/login')
        .post(middlewaresAuthentication.local, usersController.login);

    app
        .route('/user/logout')
        .post(
            [middlewaresAuthentication.refresh, middlewaresAuthentication.bearer],
            usersController.logout
        );

    app
        .route('/user')
        .post(usersController.add)
        .get(middlewaresAuthentication.bearer, usersController.list);

    app
        .route('/user/verify_email/:token')
        .get(
            middlewaresAuthentication.verificationEmail,
            usersController.checkEmail
        );

    app
        .route('/user/:id')
        .delete(middlewaresAuthentication.bearer, usersController.delete);

    app
        .route('/user/:id')
        .get(middlewaresAuthentication.bearer, usersController.findById);

}