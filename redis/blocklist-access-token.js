const redis = require('redis');
const blocklist = redis.createClient({ prefix: 'blocklist-access-token:' });
const manipulatesList = require('./manipulate-list');
const manipulateBlocklist = manipulatesList(blocklist);

const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

function generateTokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

module.exports = {
  async add(token) {
    const expireDate = jwt.decode(token).exp;
    const tokenHash = generateTokenHash(token);
    await manipulateBlocklist.add(tokenHash, '', expireDate);
  },
  async containsToken(token) {
    const tokenHash = generateTokenHash(token);
    return manipulateBlocklist.containsKey(tokenHash);
  },
};
