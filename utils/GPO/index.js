const axios = require('axios');
const path = require('path');
const https = require('https')
 
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });


    const config = {
        baseURL: process.env.BASEURL_GPO,
        maxBodyLength : Infinity,
        insecureHTTPParser: true,
        headers: {
            "Content-Type": "application/json",
            "x-api-key" : process.env.API_KEY_GPO 
        },
        httpsAgent: new https.Agent({  
            rejectUnauthorized: false,
            keepAlive: true
        })
    }

    const instance = axios.create(config) 
        

module.exports = instance
         