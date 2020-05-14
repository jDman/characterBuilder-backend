module.exports = async (model, characterId) => {
  const item = await model.findOne({ where: { characterId: characterId } });

  if (item) {
    await item.destroy();
  }
};
