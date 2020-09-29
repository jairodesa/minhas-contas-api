require('dotenv').config()

const app = require('./app');
const port = 3000;
const db = require('./src/database/configdb');
const routes = require('./routes');
routes(app);
db.connection.db('minhascontas')
app.listen(port);
