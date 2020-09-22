const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const bcrypt = require('bcrypt');

const User = require('./user-model');
const { InvalidArgumentError } = require('../utils/error');
const tokens = require('./tokens');

function checkedUser(user) {

    if (!user) {
        throw new InvalidArgumentError('There is no user with this email!');
    }
}

async function checkPassword(pass, passaHash) {
    const passwordValid = await bcrypt.compare(pass, passaHash);
    if (!passwordValid) {
        throw new InvalidArgumentError('E-mail ou senha inválidos!');
    }
}

passport.use(
    new LocalStrategy(
        {
            usernameField: 'userEmail',
            passwordField: 'userPassword',
            session: false,
        },
        async (userEmail, userPassword, done) => {
            try {
                const user = await User.findByEmail(userEmail);
                checkedUser(user);
                await checkPassword(userPassword, user.userPassword);

                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    new BearerStrategy(async (token, done) => {
        try {
            const id = await tokens.access.checks(token);
            const user = await User.findById(id);
            done(null, user, { token });
        } catch (error) {
            done(error);
        }
    })
);
