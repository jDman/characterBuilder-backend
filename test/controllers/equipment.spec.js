const { expect } = require('chai');
const sinon = require('sinon');

const equipmentController = require('../../controllers/equipment');
const Equipment = require('../../models/equipment');
const Character = require('../../models/character');

describe('equipmentController', () => {
  describe('getEquipment', () => {
    before(() => {
      sinon.stub(Equipment, 'findAll');
      sinon.stub(Character, 'findByPk');
    });

    after(() => {
      Equipment.findAll.restore();
      Character.findByPk.restore();
    });

    it('should return error 500 if accessing the database fails', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.findByPk.throws();

      await equipmentController
        .getEquipment(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return a 500 error when accessing database for equipment fails', async () => {
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
          this.equipment = data.equipment;
        },
      };

      const equipment = {
        armor_class: 2,
        weapon_proficiencies: 'simple',
        wealth: 1000,
      };

      Character.findByPk.returns({ id: '1' });

      Equipment.findAll.throws();

      await equipmentController
        .getEquipment(req, res, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return a characters equipment', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      const res = {
        message: '',
        equipment: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.equipment = data.equipment;
        },
      };

      const equipment = {
        armor_class: 2,
        weapon_proficiencies: 'simple',
        wealth: 1000,
      };

      Character.findByPk.returns({ id: '1' });

      Equipment.findAll.returns(equipment);

      await equipmentController
        .getEquipment(req, res, () => {})
        .then(() => {
          expect(res.equipment).to.eql(equipment);
          expect(res.message).to.eq(
            "Fetched character's equipment successfully."
          );
          expect(res.statusCode).to.eq(200);
        });
    });
  });

  describe('addEquipment', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Equipment, 'create');
    });

    after(() => {
      Character.findByPk.restore();
      Equipment.create.restore();
    });

    const equipment = {
      armor_class: 2,
      weapon_proficiencies: 'simple',
      wealth: 1000,
    };

    it('should throw a 500 error if cannot access the database to find a character', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: equipment,
      };

      Character.findByPk.throws();

      await equipmentController
        .addEquipment(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 500 error if cannot access the database to create equipment', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: equipment,
      };

      const res = {
        equipment: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.equipment = data.equipment;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Equipment.create.throws();

      await equipmentController
        .addEquipment(req, {}, () => {})
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
        body: equipment,
      };

      Character.findByPk.returns(null);

      await equipmentController
        .addEquipment(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should create equipment and return it with a response of 201', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: equipment,
      };

      const res = {
        equipment: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.equipment = data.equipment;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Equipment.create.returns(equipment);

      await equipmentController
        .addEquipment(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.eq(201);
          expect(res.equipment).to.eql(equipment);
          expect(res.message).to.eq(
            'Created character equipment successfully.'
          );
        });
    });
  });

  describe('editEquipment', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Equipment, 'update');
    });

    after(() => {
      Character.findByPk.restore();
      Equipment.update.restore();
    });

    const equipment = {
      armor_class: 2,
      weapon_proficiencies: 'simple',
      wealth: 1000,
    };

    it('should throw a 500 error if cannot access database for a character', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: equipment,
      };

      Character.findByPk.throws();

      await equipmentController
        .editEquipment(req, {}, () => {})
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
        body: equipment,
      };

      Character.findByPk.returns(null);

      await equipmentController
        .editEquipment(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should throw a 500 error if cannot access database for editing equipment', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: equipment,
      };
      const res = {
        equipment: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.equipment = data.equipment;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Equipment.update.throws();

      await equipmentController
        .editEquipment(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should update the equipment and return a status of 200', async () => {
      const req = {
        params: {
          characterId: '1',
        },
        body: equipment,
      };
      const res = {
        equipment: null,
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.equipment = data.equipment;
        },
      };

      Character.findByPk.returns({ id: '1' });

      Equipment.update.returns(equipment);

      await equipmentController
        .editEquipment(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.eq(200);
          expect(res.equipment).to.eql(equipment);
          expect(res.message).to.eq(
            'Updated character equipment successfully.'
          );
        });
    });
  });

  describe('deleteEquipment', () => {
    before(() => {
      sinon.stub(Character, 'findByPk');
      sinon.stub(Equipment, 'destroy');
    });

    after(() => {
      Character.findByPk.restore();
      Equipment.destroy.restore();
    });

    it('should throw a 500 error if cannot access database', async () => {
      const req = {
        params: {
          characterId: '1',
        },
      };

      Character.findByPk.throws();

      await equipmentController
        .deleteEquipment(req, {}, () => {})
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

      await equipmentController
        .deleteEquipment(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });

    it('should throw error 500 if cannot access database to destroy equipment', async () => {
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

      Equipment.destroy.throws();

      await equipmentController
        .deleteEquipment(req, {}, () => {})
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

      Equipment.destroy.returns({});

      await equipmentController
        .deleteEquipment(req, res, () => {})
        .then(() => {
          expect(res.message).to.eql(
            'Removed character equipment successfully.'
          );
          expect(res).to.have.property('statusCode', 200);
        });
    });
  });
});
