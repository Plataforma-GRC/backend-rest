const database = require("../../config/database");

module.exports = async insercao => {
  try {
    await database("notificacoes_entidades").insert(insercao);
  } catch (err) {
    console.log(err);
  }
};
