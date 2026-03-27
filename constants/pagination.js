const path = require("path");
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports = {
    limit: process.env.DB_LIMIT_DEFAULT_pageTION,
    page: process.env.DB_PAGE_DEFAULT_pageTION,
    total_limit: process.env.DB_LIMIT_TOTAL_RECORDS_DESC
}