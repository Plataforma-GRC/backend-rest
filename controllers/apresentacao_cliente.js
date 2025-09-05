const models = require('../models/apresentacao_cliente')
const response = require("../constants/response");
const yup = require('yup')
const logger = require('../services/loggerService'); 
const sendRequestOnMicroservices = require("../helpers/sendRequestOnMicroservices"); 


module.exports.getApresentacaoCliente = async function(req, res, next) {
  try{
      logger("SERVIDOR:Clientes").info("Buscar clientes")
      const {pagina, limite, missao = '', visao = '', valores = '', cliente_apresentado = ''} = req.query
      const results = await models.getApresentacaoCliente(pagina, limite, missao, visao, valores, cliente_apresentado); 
      res.status(results.statusCode).json(results)
    
  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getApresentacaoClienteId = async function(req, res, next) {
  try{

    logger("SERVIDOR:ClientesId").info("Buscar cliente pelo Id")
    const {id_apresenta} = req.params

    const results = await models.getApresentacaoClienteId(id_apresenta);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesId").error(`Erro ao buscar cliente pelo Id ${error.message}`)
  }
    
}

module.exports.getClientesApresentacaoCliente = async function(req, res, next) {
  try{
    const {cliente_apresentado} = req.params
    const results = await models.getClientesApresentacaoCliente(cliente_apresentado)
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.postApresentacaoCliente = async function(req, res, next) { 
    
   try {

      logger("SERVIDOR:postClientes").info(`Iniciando cadastrado o cliente`)

      const dados =  req.body

      const schemaApresentacaoCliente = yup.object().shape({
        missao: yup.string().required(),
        visao: yup.string().required(),
        valores: yup.string().required(),
        cliente_apresentado: yup.number().required()
      })

      logger("SERVIDOR:postClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaApresentacaoCliente.validate(dados)
      
      const result = await models.postApresentacaoCliente(validar, req)  
      
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

module.exports.patchApresentacaoCliente = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientes").info(`Iniciando actualização do cliente`)
        const {id_apresenta} = req.params
        const dados = req.body

        const schemaApresentacaoCliente = yup.object().shape({
          missao: yup.string(),
          visao: yup.string(),
          valores: yup.string(),
          cliente_apresentado: yup.number()
        })

        logger("SERVIDOR:patchClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaApresentacaoCliente.validate(dados)

        const result = await models.patchApresentacaoCliente(id_apresenta, validar, req)

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

module.exports.deleteApresentacaoCliente = async function(req, res, next) {
  try {

      logger("SERVIDOR:deleteClientes").info(`Iniciando a exlusão do cliente`)
      const {id_apresenta} = req.params
      const result = await models.deleteApresentacaoCliente(id_apresenta, req)

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
      logger("SERVIDOR:deleteClientes").error(`Erro ao deletar o cliente ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}
