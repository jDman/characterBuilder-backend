const { expect } = require('chai');
const sinon = require('sinon');

const abilitiesController = require('../../controllers/abilities');
const Abilities = require('../../models/abilities');
const Character = require('../../models/character');

describe('abilitiesController', () => {
  describe('getAbilities', () => {
    before(() => {
      sinon.stub(Abilities, 'findAll');
    });

    after(() => {
      Abilities.findAll.restore();
    });

    it('should return error 500 if accessing the database fails', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Abilities.findAll.throws();

      await abilitiesController
        .getAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return a characters abilities', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      const res = {
        message: '',
        abilities: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.abilities = data.abilities;
        },
      };

      const abilities = [
        {
          strength: 4,
          dexterity: 8,
          constitution: 9,
          intelligence: 6,
          wisdom: 5,
          charisma: 7,
        },
      ];

      Abilities.findAll.returns(abilities);

      await abilitiesController
        .getAbilities(req, res, () => {})
        .then(() => {
          expect(res.abilities).to.eql(abilities);
          expect(res.message).to.eq(
            "Fetched character's abilities successfully."
          );
          expect(res.statusCode).to.eq(200);
        });
    });
  });

  describe('addAbilities', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Abilities, 'create');
    });

    after(() => {
      Character.findByPk.restore();
      Abilities.create.restore();
    });

    const ability = {
      strength: 4,
      dexterity: 8,
      constitution: 9,
      intelligence: 6,
      wisdom: 5,
      charisma: 7,
    };

    it('should throw a 500 error if cannot access the database to find a character', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };

      Character.findByPk.throws();

      await abilitiesController
        .addAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 500 error if cannot access the database to create an ability', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };

      const res = {
        ability: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.ability = data.ability;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Abilities.create.throws();

      await abilitiesController
        .addAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 404 if no character found', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };

      Character.findByPk.returns(null);

      await abilitiesController
        .addAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should create an ability and return it with a response of 201', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };

      const res = {
        ability: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.ability = data.ability;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Abilities.create.returns(ability);

      await abilitiesController
        .addAbilities(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.eq(201);
          expect(res.ability).to.eql(ability);
          expect(res.message).to.eq(
            'Created character abilities successfully.'
          );
        });
    });
  });

  describe('editAbilities', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Abilities, 'update');
    });

    after(() => {
      Character.findByPk.restore();
      Abilities.update.restore();
    });

    const ability = {
      strength: 4,
      dexterity: 8,
      constitution: 9,
      intelligence: 6,
      wisdom: 5,
      charisma: 7,
    };

    it('should throw a 500 error if cannot access database for a character', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };

      Character.findByPk.throws();

      await abilitiesController
        .editAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 404 if no character found', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };

      Character.findByPk.returns(null);

      await abilitiesController
        .editAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should throw a 500 error if cannot access database for editing an ability', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };
      const res = {
        ability: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.ability = data.ability;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Abilities.update.throws();

      await abilitiesController
        .editAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should update the ability and return a status of 200', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: ability,
      };
      const res = {
        ability: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.ability = data.ability;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Abilities.update.returns(ability);

      await abilitiesController
        .editAbilities(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.eq(200);
          expect(res.ability).to.eql(ability);
          expect(res.message).to.eq(
            'Updated character abilities successfully.'
          );
        });
    });
  });

  describe('deleteAbilities', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Abilities, 'destroy');
    });

    after(() => {
      Character.findByPk.restore();
      Abilities.destroy.restore();
    });

    it('should throw a 500 error if cannot access database', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.findByPk.throws();

      await abilitiesController
        .deleteAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 404 error if a character is not found', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.findByPk.returns(null);

      await abilitiesController
        .deleteAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should throw error 500 if cannot access database to destroy abilities', async () => {
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

      Character.findByPk.returns({ id: '1' });

      Abilities.destroy.throws();

      await abilitiesController
        .deleteAbilities(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return status 200 and confirmation message', async () => {
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

      Character.findByPk.returns({ id: '1' });

      Abilities.destroy.returns({});

      await abilitiesController
        .deleteAbilities(req, res, () => {})
        .then(() => {
          expect(res.message).to.eql(
            'Removed character abilities successfully.'
          );
          expect(res).to.have.property('statusCode', 200);
        });
    });
  });
});
