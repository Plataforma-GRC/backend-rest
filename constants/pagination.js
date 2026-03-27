const path = require("path");
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports = {
    limit: process.env.DB_LIMIT_DEFAULT_pagination,
    page: process.env.DB_PAGE_DEFAULT_pagination,
    total_limit: process.env.DB_LIMIT_TOTAL_RECORDS_DESC
}