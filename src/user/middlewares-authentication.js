const passport = require('passport');
const User = require('./user-model');
const tokens = require('./tokens');

module.exports = {
  local(req, res, next) {
    passport.authenticate(
      'local',
      { session: false },
      (error, user, info) => {

        if (error && error.name === 'InvalidArgumentError') {
          return res.status(401).json({ error: error.message });
        }

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        if (!user) {
          return res.status(401).json({ valor: user });
        }
        req.user = user;
        return next();
      }
    )(req, res, next);
  },

  bearer(req, res, next) {
    passport.authenticate(
      'bearer',
      { session: false },
      (error, user, info) => {
        if (error && error.name === 'JsonWebTokenErrorr') {
          return res.status(401).json({ error: error.message });
        }

        if (error && error.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ error: error.message, expiredAt: error.expiredAt });
        }

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        if (!user) {
          return res.status(401).json();
        }

        req.token = info.token;
        req.user = user;
        return next();
      }
    )(req, res, next);
  },

  async refresh(req, res, next) {
    const { refreshToken } = req.body;
    try {

      const id = await tokens.refresh.checks(refreshToken);
      await tokens.refresh.invalidate(refreshToken);
      req.user = await User.findById(id);
      return next();
    } catch (error) {
      if (error.name === 'InvalidArgumentError') {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  },

  async verificationEmail(req, res, next) {
    try {
      const { token } = req.params;
      const id = await tokens.verificationEmail.checks(token);
      const userEmail = await User.findById(id);
      req.user = userEmail;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: error.message });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: error.message,
          expiradoEm: error.expiredAt,
        });
      }

      return res.status(500).json({ error: error.message });
    }
  },
};
