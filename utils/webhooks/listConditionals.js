const database = require("../../config/database");

module.exports = async (id_evento, entidade_aceite) => {
  const list = await database("webhooks_endpoints").where({
    evento: id_evento,
    entidade_aceite,
    activo: "true"
  });
  if (list.length > 0) {
    return list;
  } else {
    const listNew = await database("webhooks_endpoints").where({
      evento: 0,
      entidade_aceite,
      activo: "true"
    });
    if (listNew.length > 0) {
      return listNew;
    } else {
      return null;
    }
  }
};
