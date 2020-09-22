const User = require('./user-model');
const { InvalidArgumentError } = require('../utils/error');

const tokens = require('./tokens');
const { EmailVerification } = require('./emails');

function generatesAndress(route, token) {
    const baseURL = process.env.BASE_URL;
    return `${baseURL}${route}${token}`;
}

module.exports = {
    async add(req, res) {
        const { _id, userName, userEmail, userPassword } = req.body;
        try {
            const user = new User({
                userName,
                userEmail,
                userPassword,
                useremailVerified: false
            })
            await user.addPassword(userPassword);
            await user.add();

            const token = tokens.verificationEmail.created(user.id);
            const andress = generatesAndress('/user/verify_email/', token);
            const emailVerification = new EmailVerification(user, andress);
            emailVerification.sendEmail().catch(console.log);
            res.status(201).json();
        } catch (erro) {
            if (erro instanceof InvalidArgumentError) {
                return res.status(400).json({ erro: erro.message });
            }
            res.status(500).json({ erro: erro.message });
        }
    },
    async login(req, res) {
        try {
            console.log(req.user)
            const accessToken = tokens.access.created(req.user.id);
            const refreshToken = await tokens.refresh.created(req.user.id);
            const user = {
                id: req.user._id,
                name: req.user.userName,
                email: req.user.userEmail,
                refreshToken: refreshToken
            }

            res.set('Authorization', accessToken);
            res.status(200).json({ accessToken, user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async logout(req, res) {
        try {
            const token = req.token;
            await tokens.access.invalidate(token);
            res.status(204).json();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async checkEmail(req, res) {
        try {
            const user = new User({
                id: req.user._id,
                userName: req.user.userName,
                userEmail: req.user,
                userPassword: req.user,
                useremailVerified: true
            })
            //  const user = req.user;
            await user.checkEmail();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async list(req, res) {
        try {
            const user = new User({})
            const userList = await user.list();
            res.json(userList);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async findById(req, res) {
        try {
            const userList = await User.findById(req.params.id);
            res.json(userList);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },
    async delete(req, res) {
        try {
            const user = await User.findById(req.params.id);
            await user.delete();
            res.status(200).json();
        } catch (erro) {
            res.status(500).json({ erro: erro });
        }
    },
}