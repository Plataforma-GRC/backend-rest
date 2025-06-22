const models = require('../models/respostas_perguntas_categorias')
const response = require("../constants/response");
const yup = require('yup')
const logger = require('../services/loggerService'); 
const sendRequestOnMicroservices = require("../helpers/sendRequestOnMicroservices"); 


module.exports.getRespostasCategoriazadas = async function(req, res, next) {
  try{
      logger("SERVIDOR:Clientes").info("Buscar clientes")
      const {pagina, limite, resposta = '', pergunta_id = ''} = req.query
      const results = await models.getRespostasCategoriazadas(pagina, limite, resposta, pergunta_id); 
      res.status(results.statusCode).json(results)
    
  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getRespostasCategoriazadasPoPergunta = async function(req, res, next) {
  try{

    logger("SERVIDOR:ClientesId").info("Buscar cliente pelo Id")
    const {pergunta_id} = req.params

    const results = await models.getRespostasCategoriazadasPoPergunta(pergunta_id);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesId").error(`Erro ao buscar cliente pelo Id ${error.message}`)
  }
    
}


module.exports.postRespostasCategoriazadas = async function(req, res, next) { 
    
   try {

      logger("SERVIDOR:postClientes").info(`Iniciando cadastrado o cliente`)

      const dados =  req.body

      const schemaRespostasCategoriazadas = yup.object().shape({
        pergunta_id: yup.number().required(),
        resposta: yup.string().required()
      })

      logger("SERVIDOR:postClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaRespostasCategoriazadas.validate(dados)
      
      const result = await models.postRespostasCategoriazadas(validar, req)  
      
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

module.exports.patchRespostasCategoriazadas = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientes").info(`Iniciando actualização do cliente`)
        const {id_pergunta} = req.params
        const dados = req.body

        const schemaRespostasCategoriazadas = yup.object().shape({
          pergunta_id: yup.number(),
          resposta: yup.string(),
        })

        logger("SERVIDOR:patchClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaRespostasCategoriazadas.validate(dados)

        const result = await models.patchRespostasCategoriazadas(id_pergunta, validar, req)

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

module.exports.deleteRespostasCategoriazadas = async function(req, res, next) {
  try {

      logger("SERVIDOR:deleteClientes").info(`Iniciando a exlusão do cliente`)
      const {id_pergunta} = req.params
      const result = await models.deleteRespostasCategoriazadas(id_pergunta, req)

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
