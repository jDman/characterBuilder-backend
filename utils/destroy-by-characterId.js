module.exports = async (model, characterId) => {
  await model.destroy({ where: { characterId: characterId } });
};
