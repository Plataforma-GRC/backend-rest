const database = require("../../config/database");

module.exports = async (
  id_endpoint = null,
  resposta = null,
  enviado = null,
  statusCode = null,
  entidade,
  id_log_evento,
  informacao
) => {
  await database("webhooks_logs").insert({ endpoint: id_endpoint, resposta, enviado, statusCode });
};
