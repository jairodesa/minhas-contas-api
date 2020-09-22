module.exports = {
  routes: require('./users-routes'),
  controller: require('./users-controller'),
  model: require('./user-model'),
  strategiesAuthentication: require('./strategies-authentication'),
  middlewaresAuthentication: require('./middlewares-authentication')

};
