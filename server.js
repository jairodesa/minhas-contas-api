require('dotenv').config()

const app = require('./app');
const port = 4000;
const db = require('./src/database/configdb');
const routes = require('./routes');
routes(app);
db.connection.db('minhascontas')
app.listen(port);
