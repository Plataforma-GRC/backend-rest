const database = require("../../config/database");

module.exports = async (insercao) => {
  try {
    await database("logs_entidade").insert(insercao);
  } catch (err) {
    console.log(err);
  }
};
