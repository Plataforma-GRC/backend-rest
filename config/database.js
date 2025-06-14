const path = require("path");
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });  

const knex = require('knex')({
    client: process.env.DB_DRIVER,
    connection:{
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE    
    },
    
    acquireConnectionTimeout: 1000000,
    pool: {
        min: 5,
        max: 30,
        acquireTimeoutMillis: 300000,
        createTimeoutMillis: 300000,
        destroyTimeoutMillis: 300000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis:1000,
        createRetryIntervalMillis: 2000 
      }
})
  

module.exports = knex         
