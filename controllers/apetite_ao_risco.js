const models = require('../models/apetite_ao_risco')
const response = require("../constants/response");
const yup = require('yup')
const logger = require('../services/loggerService'); 
const sendRequestOnMicroservices = require("../helpers/sendRequestOnMicroservices"); 


module.exports.getApetites = async function(req, res, next) {
  try{
      logger("SERVIDOR:Clientes").info("Buscar clientes")
      const {pagina, limite, pontuacao_minima = '', pontuacao_maxima = '', apetite = '', descricao = '', cliente_apetite = '',} = req.query
      const results = await models.getApetites(pagina, limite, pontuacao_minima, pontuacao_maxima, apetite, descricao, cliente_apetite ); 
      res.status(results.statusCode).json(results)
    
  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getApetiteId = async function(req, res, next) {
  try{

    logger("SERVIDOR:ClientesId").info("Buscar cliente pelo Id")
    const {id_apetite} = req.params

    const results = await models.getApetiteId(id_apetite);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesId").error(`Erro ao buscar cliente pelo Id ${error.message}`)
  }
    
}

module.exports.getClientesApetite = async function(req, res, next) {
  try{
    const {cliente_apetite} = req.params
    const results = await models.getClientesApetite(cliente_apetite)
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.postApetite = async function(req, res, next) { 
    
   try {

      logger("SERVIDOR:postClientes").info(`Iniciando cadastrado o cliente`)

      const dados =  req.body

      const schemaApetite = yup.object().shape({
        pontuacao_minima: yup.number().required(),
        pontuacao_maxima: yup.number().required(),
        apetite: yup.string().required(),
        descricao: yup.string().required(),
        cliente_apetite: yup.number().required()
      })

      logger("SERVIDOR:postClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaApetite.validate(dados)
      
      const result = await models.postApetite(validar, req)  
      
      var wk = result.webhook
      var lg = result.logs
      var nt = result.notification  
      
      delete result.webhook
      delete result.logs
      delete result.notification

      res.status(result.statusCode).json(result)

      if(result.status == "sucesso"){
          sendRequestOnMicroservices({lg, nt, wk})        
      }    
      
      
   } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:postClientes").error(`Erro ao cadastrar o cliente ${error.message}`)

      if(error?.path){
        const rs = response("erro", 412, error.message);
        res.status(rs.statusCode).json(rs)        
      }else{  
        const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
        res.status(rs.statusCode).json(rs)
      }
   }
    
}

module.exports.patchApetite = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientes").info(`Iniciando actualização do cliente`)
        const {id_apetite} = req.params
        const dados = req.body

        const schemaApetite = yup.object().shape({
          pontuacao_minima: yup.number(),
          pontuacao_maxima: yup.number(),
          apetite: yup.string(),
          descricao: yup.string()
        })

        logger("SERVIDOR:patchClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaApetite.validate(dados)

        const result = await models.patchApetite(id_apetite, validar, req)

        var wk = result.webhook
        var lg = result.logs
        var nt = result.notification
        
        delete result.webhook
        delete result.logs
        delete result.notification
        
        res.status(result.statusCode).json(result)

        if(result.status == "sucesso"){
          
          sendRequestOnMicroservices({lg, nt, wk})

        }
        

      } catch (error) {
        console.error(error.message)
        logger("SERVIDOR:patchClientes").error(`Erro ao actualizar o cliente ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
      }
    
}
