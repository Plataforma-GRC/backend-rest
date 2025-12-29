const amqplib = require('amqplib');
const colorTerminal = require('cli-color');
const logger = require('../services/loggerService');  
require("dotenv").config({ path: path.resolve(path.join(__dirname, '../','.env')) });

async function initRabbitMQ() {

    try {
        logger("SERVIDOR").debug(`Á conectar com microserviço RabbitMQ`)
        console.log(colorTerminal.magentaBright.blink.bold.italic("Á conectar com RabbitMQ"))
        const connection = await amqplib.connect(process.env.ACESSO_RABBIMQ);
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_RABBITMQ_ALL);
        logger("SERVIDOR").info(`Conectado microserviço RabbitMQ`)
        console.log(colorTerminal.greenBright.blink.bold.italic("Conectado com RabbitMQ 🛜"))
    
        return channel;
        
    } catch (error) {
        logger("SERVIDOR").info(`Conectado microserviço RabbitMQ`)
        console.log(colorTerminal.redBright.blink.bold.italic("Erro ao conectar com RabbitMQ ❌"))
    }
} 

module.exports = initRabbitMQ  