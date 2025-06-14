const pino = require('pino')
const prettifier = require('pino-pretty');
const fs = require('fs')
const path = require('path');
require("dotenv").config({ path: path.resolve(path.join(__dirname, '../','.env')) });

  module.exports = function (name){
    const file = new Date().toJSON().replaceAll("-","").split("T")[0].concat(".log")
    const dirLogs = process.env.DIR_LOGS_APP

    if(!fs.existsSync(path.resolve(__dirname,"../", path.join("logs/", dirLogs)))) fs.mkdirSync(path.resolve(__dirname,"../", path.join("logs/", dirLogs)))

    const fileDestination = path.resolve(__dirname,"../",path.join('logs', dirLogs, file))

    const levels = {
      http: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60,
    };

    const logger = pino({
        prettyPrint: {colorize:false},
        prettifier,
        customLevels: levels,
        useOnlyCustomLevels: true,
        level: 'http',
        translateTime: "SYS:standard",
        timestamp: pino.stdTimeFunctions.isoTime,
        name: name
    },pino.destination(fileDestination))

    return logger
}


 
 