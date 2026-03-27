const clientRedis =  require('../infra/redis');
const path = require("path");
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });
module.exports = function(status, statusCode, message, format = 'json', other){

    const URLKey = other?.url

    const response = {
        status,
        statusCode,
        format,
        ...other,
        message,
    };

    (async function(){
        if(URLKey) await clientRedis.setEx(URLKey, process.env.TIME_EXPIRE, Buffer.from(JSON.stringify(response)))
    })();

    return response
}