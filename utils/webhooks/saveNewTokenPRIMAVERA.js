const database = require("../../config/database");

module.exports = async (
  id_endpoint = null,
  bearer_token
) => {
  await database("webhooks_endpoints").where({id_endpoint}).update({ bearer_token });
};
