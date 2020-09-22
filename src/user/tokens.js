const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');

const { invalidatergumentError } = require('../utils/error');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');
const blocklistccessToken = require('../../redis/blocklist-access-token');

const createsTokenJWT = (id, [TimeQuantity, UnitTime]) => {
  const payload = { id };
  const token = jwt.sign(payload, process.env.CHAVE_JWT, {
    expiresIn: TimeQuantity + UnitTime,
  });
  return token;
}

async function checksTokenJWT(token, name, blocklist) {
  await checkTokenBlocklist(token, name, blocklist);
  const { id } = jwt.verify(token, process.env.CHAVE_JWT);
  return id;
}

async function checkTokenBlocklist(token, name, blocklist) {
  if (!blocklist) {
    return;
  }

  const tokenNaBlocklist = await blocklist.containsToken(token);
  if (tokenNaBlocklist) {
    throw new jwt.JsonWebTokenError(`${name} invalid to logout!`);
  }
}

function invalidTokenJWT(token, blocklist) {
  return blocklist.add(token);
}

async function createTokenOpac(id, [TimeQuantity, UnitTime], allowlist) {
  const tokenOpaco = crypto.randomBytes(24).toString('hex');
  const dataExpiration = moment().add(TimeQuantity, UnitTime).unix();
  await allowlist.add(tokenOpaco, id, dataExpiration);
  return tokenOpaco;
}

async function verificadTokenOpac(token, name, allowlist) {
  checksTokenSent(token, name);
  const id = await allowlist.searchValue(token);
  checksTokenValid(id, name);
  return id;
}

async function invalidateTokenOpaque(token, allowlist) {
  await allowlist.delete(token);
}

function checksTokenValid(id, name) {
  if (!id) {
    throw new invalidatergumentError(`${name} invalid!`);
  }
}

function checksTokenSent(token, name) {
  if (!token) {
    throw new invalidatergumentError(`${name} not sent!`);
  }
}


module.exports = {
  access: {
    name: 'access token',
    list: blocklistccessToken,
    expiration: [15, 'm'],
    created(id) {
      return createsTokenJWT(id, this.expiration);
    },
    checks(token) {
      return checksTokenJWT(token, this.name, this.list);
    },
    invalidate(token) {
      return invalidTokenJWT(token, this.list);
    }
  },
  refresh: {
    name: 'refresh token',
    list: allowlistRefreshToken,
    expiration: [5, 'd'],
    created(id) {
      return createTokenOpac(id, this.expiration, this.list);
    },
    async checks(token) {
      return await verificadTokenOpac(token, this.name, this.list);
    },
    invalidate(token) {
      return invalidateTokenOpaque(token, this.list);
    }
  },
  verificationEmail: {
    name: 'email verification token',
    expiration: [1, 'h'],
    created(id) {
      return createsTokenJWT(id, this.expiration);
    },
    checks(token) {
      return checksTokenJWT(token, this.name);
    }
  }
};
