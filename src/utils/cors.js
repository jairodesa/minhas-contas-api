module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "OPTIONS,Accept,Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method,x-access-key, Access-Control-Request-Header");
    next();
}