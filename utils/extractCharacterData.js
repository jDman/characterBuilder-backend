module.exports = (character) => {
  return {
    id: character.id,
    name: character.name,
    background: character.background,
    additional_info: character.additional_info,
    raceType: character.raceType,
    classType: character.classType,
    lastUpdated: character.updatedAt,
  };
};
