const userMongoose = require("./user-mongoose")
const { InternalServerError, InvalidArgumentError } = require('../utils/error');
const validates = require('../utils/common-validations');
const bcrypt = require('bcrypt');
const objectId = require("../database/configdb").connection.objectId;

class User {
    constructor(user) {
        this.id = user.id;
        this.userName = user.userName;
        this.userEmail = user.userEmail;
        this.userPassword = user.userPassword;
        this.useremailVerified = user.useremailVerified;
        //  this.validate();
    }
    async add() {

        if (await User.findByEmail(this.userEmail)) {
            throw new InvalidArgumentError('The user already exists!');
        }
        const user = new userMongoose({
            userName: this.userName,
            userEmail: this.userEmail,
            userPassword: await User.generatePassword(this.userPassword)
        });
        try {

            await user.save();
            const { _id } = await User.findByEmail(user.userEmail)
            this.id = _id;
        } catch (error) {
            throw new InternalServerError('Error adding user!' + error);
        }
    }
    async list() {
        try {
            return await userMongoose.find();
        } catch (error) {
            throw new InternalServerError('Error listing users!' + error.message);
        }
    }
    async delete() {
        var query = userMongoose.where({ _id: objectId(this.id) });

        return query.deleteOne((err, user) => {
            if (err) throw new InternalServerError(err);
        });
    }
    static findById(id) {
        var query = userMongoose.where({ _id: objectId(id) });
        return query.findOne((err, user) => {

            if (err) throw new InternalServerError(err);

            return user
        });
    }
    static findByEmail(email) {
        var query = userMongoose.where({ userEmail: email });

        return query.findOne(function (error, user) {
            if (error) throw new InternalServerError(`error by e-mail ${error}`);
            return user
        });
    }
    static generatePassword(password) {
        const HashCost = 12;
        return bcrypt.hash(password, HashCost);
    }
    async addPassword(pass) {
        validates.fieldStringNotNull(pass, 'password');
        validates.fieldSizeMinimum(pass, 'password', 8);
        validates.fieldSizeMaximum(pass, 'password', 64);

        this.senhaHash = await User.generatePassword(pass);
    }

    validate() {
        validates.fieldStringNotNull(this.userName, 'name');
        validates.fieldStringNotNull(this.userEmail, 'email');
    }

    async checkEmail() {
        const res = await userMongoose.updateOne({ _id: objectId(this.id) }, { useremailVerified: this.useremailVerified });
    }

}

module.exports = User