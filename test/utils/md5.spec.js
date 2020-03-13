const { expect } = require('chai');

const crypto = require('crypto');

const generateMD5 = require('../../utils/generateMD5');

describe('generateMD5', () => {
  it('should generate a hashed string', () => {
    const text = 'md5';
    const expectedHash = crypto
      .createHash(text)
      .update(text)
      .digest('hex');

    expect(generateMD5(text)).to.equal(expectedHash);
  });
});
