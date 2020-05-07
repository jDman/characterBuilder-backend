const { expect } = require('chai');

const extractCharacterData = require('../../utils/extractCharacterData');

const characterData = {
  id: '1',
  name: 'Haggard',
  background: 'acolyte',
  additional_info: '',
  raceType: 'elf',
  classType: 'warrior',
  updatedAt: '2020-05-07T09:48:28.361Z',
  createdAt: '2020-05-07T09:48:28.361Z',
};

describe('extractCharacterData', () => {
  it('should extract and return the expected values from character data', () => {
    const data = extractCharacterData(characterData);

    expect(data).to.eql({
      id: '1',
      name: 'Haggard',
      background: 'acolyte',
      additional_info: '',
      raceType: 'elf',
      classType: 'warrior',
      lastUpdated: '2020-05-07T09:48:28.361Z',
    });
  });
});
