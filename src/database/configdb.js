const mongoose = require('mongoose');


module.exports = {
    connection: {
        db(dbName) {
            mongoose.connect(process.env.URL_BANCO, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            })
            const db = mongoose.connection
            db.on('error', err => console.log(err))
            db.once('open', () => console.log("connection database"))
            return db;
        },
        objectId(id) {
            return mongoose.Types.ObjectId(id)
        }
    }
}