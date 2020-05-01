const { expect } = require('chai');
const sinon = require('sinon');

const characterController = require('../../controllers/character');
const Abilities = require('../../models/abilities');
const Character = require('../../models/character');

const charactersMock = [
  {
    name: 'Haggard',
    background: 'acolyte',
    race: 'elf',
    class: 'warrior',
  },
  {
    name: 'Jurg',
    background: 'folk_hero',
    race: 'dwarf',
    class: 'rogue',
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
          expect(res.characters).to.equal(charactersMock);
          expect(res.totalCharacters).to.equal(2);
        });
    });
  });

  describe('getCharacter', () => {
    before(() => {
      sinon.stub(Character, 'findAll');
    });

    after(() => {
      Character.findAll.restore();
    });

    it('should throw a 500 error when fetching a character from the database fails', async () => {
      const req = {
        params: {
          characterId: '234',
        },
      };

      Character.findAll.throws();

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

      Character.findAll.returns({
        ...charactersMock[0],
      });

      await characterController
        .getCharacter(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.equal(200);
          expect(res.character).to.eql(charactersMock[0]);
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
    };

    before(() => {
      sinon.stub(Character, 'create');
    });

    after(() => {
      Character.create.restore();
    });

    it('should return error 500 if accessing the database fails', async () => {
      const req = {
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
        ...aCharacter,
      });

      await characterController
        .addCharacter(req, res, () => {})
        .then(() => {
          expect(res.character).to.eql(aCharacter);
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
          expect(res.character).to.eql(aCharacter);
          expect(res.message).to.eq('Updated character successfully.');
          expect(res.statusCode).to.eq(200);
        });
    });
  });
  describe('deleteCharacter', () => {
    before(() => {
      sinon.stub(Character, 'destroy');
    });

    after(() => {
      Character.destroy.restore();
    });

    it('should return error 500 if accessing the database fails', async () => {
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

    it('should successfully remove a character', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

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
