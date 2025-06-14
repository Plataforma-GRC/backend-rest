const path = require("path");
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports = {
    limite: process.env.DB_LIMIT_DEFAULT_PAGINATION,
    pagina: process.env.DB_PAGE_DEFAULT_PAGINATION,
    total_limite: process.env.DB_LIMIT_TOTAL_RECORDS_DESC
}