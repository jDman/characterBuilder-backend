const crypto = require('crypto');

module.exports = generateMD5 = text =>
  crypto
    .createHash('md5')
    .update(text)
    .digest('hex');
