const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;

chai.use(sinonChai);

const destroyByCharacterId = require('../../utils/destroy-by-characterId');
const Abilities = require('../../models/abilities');

describe('destroyByCharacterId', () => {
  before(() => {
    sinon.stub(Abilities, 'destroy');
  });

  after(() => {
    Abilities.destroy.restore();
  });

  it('should call destroy on the passed in model, searching with the passed characterId', () => {
    const characterId = '3';
    destroyByCharacterId(Abilities, characterId);

    expect(Abilities.destroy).to.have.been.calledWith({
      where: { characterId: characterId },
    });
  });
});
