const axios = require('axios');
const path = require("path");
const logger = require('../services/loggerService');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) }); 

module.exports = async function ({lg, nt, wk, ft}){

    if(wk){
        logger("SERVIDOR:PRT").debug(`A enviar para WEBHOOK ${process.env.HOST_WEBHOOK}`)
        try {
            const res = await axios.post(process.env.HOST_WEBHOOK, wk);
            logger("SERVIDOR:PRT").info(`${JSON.stringify(wk)}`)
            logger("SERVIDOR:PRT").info(`enviado para WEBHOOK`)
            logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
        
        } catch (erro) {
            console.log(erro.message)
            logger("SERVIDOR:PRT").warn(`ERRO: ${erro.message}`)
            logger("SERVIDOR:PRT").info(`Erro, Tentando em ${process.env.HOST_WEBHOOK_RETRY}`)
            try {
                const res = await axios.post(process.env.HOST_WEBHOOK_RETRY, wk);
                logger("SERVIDOR:PRT").info(`${JSON.stringify(wk)}`)
                logger("SERVIDOR:PRT").info(`enviado para WEBHOOK`)
                logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
            
            } catch (erro) {
                console.log(erro.message)
                logger("SERVIDOR:PRT").error(`ERRO: ${erro.message}`)
            }
        }
        
            
    }    
    
    if(lg){
        logger("SERVIDOR:PRT").debug(`A enviar para LOGS ${process.env.HOST_LOGS}`)
        try {
            const res = await axios.post(process.env.HOST_LOGS, lg);
            logger("SERVIDOR:PRT").info(`${JSON.stringify(lg)}`)
            logger("SERVIDOR:PRT").info(`enviado para LOGS`)
            logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
        
        } catch (erro) {
            console.log(erro.message)
            logger("SERVIDOR:PRT").warn(`ERRO: ${erro.message}`)
            logger("SERVIDOR:PRT").info(`Erro, Tentando em ${process.env.HOST_LOGS_RETRY}`)
            try {
                const res = await axios.post(process.env.HOST_LOGS_RETRY, lg);
                logger("SERVIDOR:PRT").info(`${JSON.stringify(lg)}`)
                logger("SERVIDOR:PRT").info(`enviado para LOGS`)
                logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
                
                } catch (erro) {
                console.log(erro.message)
                logger("SERVIDOR:PRT").error(`ERRO: ${erro.message}`)
            }
        }
    }
    
    if(nt){
        logger("SERVIDOR:PRT").debug(`A enviar para NOTIFICADOR ${process.env.HOST_NOTIFICACAO}`)
        try {
            const res = await axios.post(process.env.HOST_NOTIFICACAO, nt);
            logger("SERVIDOR:PRT").info(`${JSON.stringify(nt)}`)
            logger("SERVIDOR:PRT").info(`enviado para NOTIFICADOR`)
            logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
        
        } catch (erro) {
            console.log(erro.message)
            logger("SERVIDOR:PRT").warn(`ERRO: ${erro.message}`)
            logger("SERVIDOR:PRT").info(`Erro, Tentando em ${process.env.HOST_NOTIFICACAO_RETRY}`)
            try {
                const res = await axios.post(process.env.HOST_NOTIFICACAO_RETRY, nt);
                logger("SERVIDOR:PRT").info(`${JSON.stringify(nt)}`)
                logger("SERVIDOR:PRT").info(`enviado para NOTIFICADOR`)
                logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
            
            } catch (erro) {
                console.log(erro.message)
                logger("SERVIDOR:PRT").error(`ERRO: ${erro.message}`)
            }
        }
    }

    if(ft){
        logger("SERVIDOR:PRT").debug(`A enviar para MFT ${process.env.HOST_MFT}`)
        try {
            const res = await axios.post(process.env.HOST_MFT, ft);
            logger("SERVIDOR:PRT").info(`${JSON.stringify(ft)}`)
            logger("SERVIDOR:PRT").info(`enviado para MFT`)
            logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
        
        } catch (erro) {
            console.log(erro.message)
            logger("SERVIDOR:PRT").warn(`ERRO: ${erro.message}`)
            logger("SERVIDOR:PRT").info(`Erro, Tentando em ${process.env.HOST_MFT_RETRY}`)
            try {
                const res = await axios.post(process.env.HOST_MFT_RETRY, ft);
                logger("SERVIDOR:PRT").info(`${JSON.stringify(ft)}`)
                logger("SERVIDOR:PRT").info(`enviado para MFT`)
                logger("SERVIDOR:PRT").info(`STATUS: ${res.status}`)
            
            } catch (erro) {
                console.log(erro.message)
                logger("SERVIDOR:PRT").error(`ERRO: ${erro.message}`)
            }
        }
    }
}