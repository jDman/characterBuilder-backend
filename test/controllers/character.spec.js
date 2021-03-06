const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;

const characterController = require('../../controllers/character');
const Abilities = require('../../models/abilities');
const Equipment = require('../../models/equipment');
const Traits = require('../../models/traits');
const Character = require('../../models/character');

const charactersMock = [
  {
    id: '1',
    name: 'Haggard',
    background: 'acolyte',
    additional_info: '',
    raceType: 'elf',
    classType: 'warrior',
    updatedAt: '2020-05-07T09:48:28.361Z',
  },
  {
    id: '2',
    name: 'Jurg',
    background: 'folk_hero',
    additional_info: '',
    raceType: 'dwarf',
    classType: 'rogue',
    updatedAt: '2020-05-07T09:48:28.361Z',
  },
];

const returnedCharactersMock = [
  {
    id: '1',
    name: 'Haggard',
    background: 'acolyte',
    additional_info: '',
    raceType: 'elf',
    classType: 'warrior',
    lastUpdated: '2020-05-07T09:48:28.361Z',
  },
  {
    id: '2',
    name: 'Jurg',
    background: 'folk_hero',
    additional_info: '',
    raceType: 'dwarf',
    classType: 'rogue',
    lastUpdated: '2020-05-07T09:48:28.361Z',
  },
];

describe('character controller', () => {
  describe('getCharacters', () => {
    before(() => {
      sinon.stub(Character, 'count');
      sinon.stub(Character, 'findAll');
    });

    after(() => {
      Character.count.restore();
      Character.findAll.restore();
    });

    it('should throw an error 500 if cannot access database through Character model count method', async () => {
      const req = {
        user: { id: '123' },
        query: { page: 1 },
      };

      Character.count.throws();

      await characterController
        .getCharacters(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 500 if cannot access database through Character model findAll method', async () => {
      const req = {
        user: { id: '123' },
        query: { page: 1 },
      };

      Character.count.returns(1);
      Character.findAll.throws();

      await characterController
        .getCharacters(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return characters and total items', async () => {
      const req = {
        user: { id: '123' },
        query: { page: 1 },
      };

      const res = {
        characters: null,
        totalCharacters: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.characters = data.characters;
          this.totalCharacters = data.totalCharacters;
        },
      };

      Character.count.returns(2);
      Character.findAll.returns(charactersMock);

      await characterController
        .getCharacters(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.equal(200);
          expect(res.characters).to.eql(returnedCharactersMock);
          expect(res.totalCharacters).to.equal(2);
        });
    });
  });

  describe('getCharacter', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
    });

    after(() => {
      Character.findByPk.restore();
    });

    it('should throw a 500 error when fetching a character from the database fails', async () => {
      const req = {
        params: {
          characterId: '234',
        },
      };

      Character.findByPk.throws();

      await characterController
        .getCharacter(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return a character', async () => {
      const req = {
        params: {
          characterId: '234',
        },
      };

      const res = {
        character: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.character = data.character;
        },
      };

      Character.findByPk.returns({
        ...charactersMock[0],
      });

      await characterController
        .getCharacter(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.equal(200);
          expect(res.character).to.eql(returnedCharactersMock[0]);
        });
    });
  });

  describe('addCharacter', () => {
    const aCharacter = {
      name: 'Tester',
      background: 'soldier',
      additional_info: '',
      raceType: 'human',
      classType: 'warrior',
      updatedAt: '2020-05-07T09:48:28.361Z',
    };

    const returnedCharacter = {
      id: '1',
      name: 'Tester',
      background: 'soldier',
      additional_info: '',
      raceType: 'human',
      classType: 'warrior',
      lastUpdated: '2020-05-07T09:48:28.361Z',
    };

    before(() => {
      sinon.stub(Character, 'create');
    });

    after(() => {
      Character.create.restore();
    });

    it('should return error 500 if accessing the database fails', async () => {
      const req = {
        user: { id: '123' },
        body: aCharacter,
      };

      Character.create.throws();

      await characterController
        .addCharacter(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should create a character with a response status of 201', async () => {
      const req = {
        user: { id: '123' },
        body: aCharacter,
      };

      const res = {
        character: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.character = data.character;
          this.message = data.message;
        },
      };

      Character.create.returns({
        id: '1',
        ...aCharacter,
      });

      await characterController
        .addCharacter(req, res, () => {})
        .then(() => {
          expect(res.character).to.eql(returnedCharacter);
          expect(res.message).to.eq('Created character successfully.');
          expect(res.statusCode).to.eq(201);
        });
    });
  });

  describe('editCharacter', () => {
    const aCharacter = {
      id: '1',
      name: 'Tester',
      background: 'soldier',
      additional_info: '',
      raceType: 'human',
      classType: 'warrior',
      updatedAt: '2020-05-07T09:48:28.361Z',
    };

    const returnedCharacter = {
      id: '1',
      name: 'Tester',
      background: 'soldier',
      additional_info: '',
      raceType: 'human',
      classType: 'warrior',
      lastUpdated: '2020-05-07T09:48:28.361Z',
    };

    before(() => {
      sinon.stub(Character, 'update');
    });

    after(() => {
      Character.update.restore();
    });

    it('should return error 500 if accessing the database fails', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: aCharacter,
      };

      Character.update.throws();

      await characterController
        .editCharacter(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should update character and return a status code of 200', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: aCharacter,
      };

      const res = {
        character: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.character = data.character;
          this.message = data.message;
        },
      };

      Character.update.returns({
        ...aCharacter,
      });

      await characterController
        .editCharacter(req, res, () => {})
        .then(() => {
          expect(res.character).to.eql(returnedCharacter);
          expect(res.message).to.eq('Updated character successfully.');
          expect(res.statusCode).to.eq(200);
        });
    });
  });
  describe('deleteCharacter', () => {
    before(() => {
      sinon.stub(Character, 'destroy');
      sinon.stub(Abilities, 'destroy');
      sinon.stub(Equipment, 'destroy');
      sinon.stub(Traits, 'destroy');
    });

    after(() => {
      Character.destroy.restore();
      Abilities.destroy.restore();
      Equipment.destroy.restore();
      Traits.destroy.restore();
    });

    it('should return error 500 if accessing the database fails when accessing Character', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.destroy.throws();

      await characterController
        .deleteCharacter(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return error 500 if accessing the database fails when accessing Abilities', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.destroy.returns(true);
      Abilities.destroy.throws();

      await characterController
        .deleteCharacter(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return error 500 if accessing the database fails when accessing Equipment', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.destroy.returns(true);
      Abilities.destroy.returns(true);
      Equipment.destroy.throws();

      await characterController
        .deleteCharacter(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return error 500 if accessing the database fails when accessing Traits', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.destroy.returns(true);
      Abilities.destroy.returns(true);
      Equipment.destroy.returns(true);
      Traits.destroy.throws();

      await characterController
        .deleteCharacter(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should successfully remove a character, its abilities, equipment and traits', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      const calledWith = { where: { characterId: '1' } };

      const res = {
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
        },
      };

      Character.destroy.returns(true);

      await characterController
        .deleteCharacter(req, res, () => {})
        .then(() => {
          expect(res.message).to.eq('Removed character successfully.');
          expect(res.statusCode).to.eq(200);
        });
    });
  });
});
