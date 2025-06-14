const redis = require('redis')
const path = require("path");
const colorTerminal = require('cli-color');
const logger = require('../services/loggerService');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) }); 

logger("SERVIDOR:REDIS").info(`A criar um client para ${process.env.URL_REDIS}`)
const client = redis.createClient({
    url: process.env.URL_REDIS
})

client.on('error', (error) =>{
    logger("SERVIDOR:REDIS").warn(`Erro na conexão no client Redis ${process.env.HOST_WEBHOOK}`)
    logger("SERVIDOR:REDIS").info(`Descrição do erro ${error.message}`)
    console.log(colorTerminal.redBright(error.message))
});

module.exports = client  