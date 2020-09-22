const redis = require('redis');
const manipulatesList = require('./manipulate-list');
const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token:' });
module.exports = manipulatesList(allowlist);