const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const spies = require('chai-spies');

const { expect } = chai;

chai.use(sinonChai);
chai.use(spies);

const destroyByCharacterId = require('../../utils/destroy-by-characterId');
const Abilities = require('../../models/abilities');

describe('destroyByCharacterId', () => {
  before(() => {
    sinon.stub(Abilities, 'findOne');
  });

  after(() => {
    Abilities.findOne.restore();
  });

  it('should call destroy on the passed in model, searching with the passed characterId', async () => {
    const characterId = '3';
    const modelInstance = { destroy: async () => {} };

    chai.spy.on(modelInstance, 'destroy');

    Abilities.findOne.returns(modelInstance);

    await destroyByCharacterId(Abilities, characterId);

    expect(Abilities.findOne).to.have.been.calledWith({
      where: { characterId: characterId },
    });
    expect(modelInstance.destroy).to.have.been.called();
  });
});
