const createError = require("http-errors")
const clientRedis =  require('../infra/redis');
const response = require("../constants/response"); 
const authClientes = require("../config/authToken");
const logger = require('../services/loggerService');
const rateLimit = require("express-rate-limit");
const path = require("path");
const fileUpload = require("express-fileupload");
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) }); 

module.exports.rateLimiter = rateLimit({
  // windowMs: 60 * 60 * 1000, // 60 minutos
  windowMs: process.env.TIME_REQUEST_FOR_DDOS, // 60 minutos
  max: 100, // Limita a cada IP 1000 solicitações por janela
  message: { 
    status: "erro",
    mensagem:
    "Muitas solicitações feitas a partir deste IP, tente novamente após uma hora. Atingiu o limite de 100 requisições por segundo (100/s)"
  }
});

module.exports.fileUploadApp =  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    limits: { fileSize: 50 * 1024 * 1024 },
})

module.exports.responseIndex = async function(req, res,){

    try {
      
        const rs = response("sucesso", 200, {
          "owner": "360 RADAR",
          "version": "1.0.10",      
        });
        
        res.status(rs.statusCode).json(rs)
        
    } catch (error) {
      
        res.status(400).json(error)
    }
}

module.exports.cacheRedis = async function(req, res, next){
  
    if(req.method == "GET"){ 

        const URLKey = req.url
        const verifyURL = await clientRedis.get(URLKey,{EX:process.env.TIME_EXPIRE})

        if(verifyURL){
            const responseJSON = JSON.parse(verifyURL)
            res.status(responseJSON.statusCode).json(responseJSON) 
            return;
        }else{
            next()
        }

    }else{

        next()
    }
        
        


}

module.exports.redirectURL = (req, res) => res.redirect("/v1")

module.exports.timeoutApp = function (req, res, next) {
  res.setTimeout(20000, function () {
    console.log("Request has timed out.");
    const rs = response("erro", 408, "Timeout, não conseguimos processar. Tente outra vez");
    res.status(rs.statusCode).json(rs)
  });

  next(); 
}

module.exports.tokenApp = (req, res) => {
    //o body deve vir com a chave dono nas propriedades
    const token = authClientes.generateToken({app: req.body}) 
    const rs = response("sucesso", 201, token);
    res.status(rs.statusCode).json(rs)  
}

module.exports.validadeTokenApp = authClientes.validateToken

module.exports.errorHandle = function (req, res, next) {
    logger("SERVIDOR").warn("Criando o erro de resposta")
    next(createError(404));
}

module.exports.errorDisplay = function (err, req, res, next) {
    // definir locais, fornecendo apenas erros no desenvolvimento
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // console.log(err)
    // renderizar a página de erro ou enviar mensagem em JSON
    const rs = response("erro", err.status || 500, "A rota que tentou solicitar não foi encontrada. Verifique a sua URI");
    res.status(rs.statusCode).json(rs)
  
    if(rs.statusCode == 500)
      logger("SERVIDOR").fatal(`Houve o erro ${err}`)
    else
      logger("SERVIDOR").warn(`Houve o erro ${err}`)
  
}

module.exports.debugSentry =  function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
}