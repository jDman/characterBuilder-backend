const { expect } = require('chai');
const sinon = require('sinon');

const traitsController = require('../../controllers/traits');
const Traits = require('../../models/traits');
const Character = require('../../models/character');

describe('traitsController', () => {
  describe('getTraits', () => {
    before(() => {
      sinon.stub(Traits, 'findAll');
      sinon.stub(Character, 'findByPk');
    });

    after(() => {
      Traits.findAll.restore();
      Character.findByPk.restore();
    });

    it('should return error 500 if accessing the database fails', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.findByPk.throws();

      await traitsController
        .getTraits(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return a 500 error when accessing database for traits fails', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      const res = {
        message: '',
        traits: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.traits = data.traits;
        },
      };

      const traits = {
        ability_score_increase: 2,
        age: 19,
        alignment: 'lawful',
        morality: 'good',
        size: 'large',
        speed: 10,
        languages: 'common',
      };

      Character.findByPk.returns({ id: '1' });

      Traits.findAll.throws();

      await traitsController
        .getTraits(req, res, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return a characters traits', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      const res = {
        message: '',
        traits: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.traits = data.traits;
        },
      };

      const traits = {
        ability_score_increase: 2,
        age: 19,
        alignment: 'lawful',
        morality: 'good',
        size: 'large',
        speed: 10,
        languages: 'common',
      };

      Character.findByPk.returns({ id: '1' });

      Traits.findAll.returns([traits]);

      await traitsController
        .getTraits(req, res, () => {})
        .then(() => {
          expect(res.traits).to.eql(traits);
          expect(res.message).to.eq("Fetched character's traits successfully.");
          expect(res.statusCode).to.eq(200);
        });
    });
  });

  describe('addTraits', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Traits, 'create');
    });

    after(() => {
      Character.findByPk.restore();
      Traits.create.restore();
    });

    const traits = {
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
        body: traits,
      };

      Character.findByPk.throws();

      await traitsController
        .addTraits(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 500 error if cannot access the database to create traits', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: traits,
      };

      const res = {
        traits: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.traits = data.traits;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Traits.create.throws();

      await traitsController
        .addTraits(req, {}, () => {})
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
        body: traits,
      };

      Character.findByPk.returns(null);

      await traitsController
        .addTraits(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should create traits and return it with a response of 201', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: traits,
      };

      const res = {
        traits: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.traits = data.traits;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Traits.create.returns(traits);

      await traitsController
        .addTraits(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.eq(201);
          expect(res.traits).to.eql(traits);
          expect(res.message).to.eq('Created character traits successfully.');
        });
    });
  });

  describe('editTraits', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Traits, 'update');
    });

    after(() => {
      Character.findByPk.restore();
      Traits.update.restore();
    });

    const traits = {
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
        body: traits,
      };

      Character.findByPk.throws();

      await traitsController
        .editTraits(req, {}, () => {})
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
        body: traits,
      };

      Character.findByPk.returns(null);

      await traitsController
        .editTraits(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should throw a 500 error if cannot access database for editing traits', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: traits,
      };
      const res = {
        traits: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.traits = data.traits;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Traits.update.throws();

      await traitsController
        .editTraits(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should update the traits and return a status of 200', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: traits,
      };
      const res = {
        traits: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.traits = data.traits;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Traits.update.returns(traits);

      await traitsController
        .editTraits(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.eq(200);
          expect(res.traits).to.eql(traits);
          expect(res.message).to.eq('Updated character traits successfully.');
        });
    });
  });

  describe('deleteTraits', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Traits, 'destroy');
    });

    after(() => {
      Character.findByPk.restore();
      Traits.destroy.restore();
    });

    it('should throw a 500 error if cannot access database', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.findByPk.throws();

      await traitsController
        .deleteTraits(req, {}, () => {})
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

      await traitsController
        .deleteTraits(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should throw error 500 if cannot access database to destroy traits', async () => {
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

      Traits.destroy.throws();

      await traitsController
        .deleteTraits(req, {}, () => {})
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

      Traits.destroy.returns({});

      await traitsController
        .deleteTraits(req, res, () => {})
        .then(() => {
          expect(res.message).to.eql('Removed character traits successfully.');
          expect(res).to.have.property('statusCode', 200);
        });
    });
  });
});
