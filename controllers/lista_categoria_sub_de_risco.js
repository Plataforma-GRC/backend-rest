const models = require('../models/lista_categoria_sub_de_risco')
const response = require("../constants/response");
const yup = require('yup')
const logger = require('../services/loggerService'); 
const sendRequestOnMicroservices = require("../helpers/sendRequestOnMicroservices"); 


module.exports.getListaCategoriaSubAoRisco = async function(req, res, next) {
  try{
      logger("SERVIDOR:Clientes").info("Buscar clientes")
      const {pagina, limite, descricao_categoria_sub = '', cliente_categorizado_fk = '', categoria_de_risco_id_fk = ''} = req.query
      const results = await models.getListaCategoriaSubAoRisco(pagina, limite, descricao_categoria_sub, cliente_categorizado_fk, categoria_de_risco_id_fk); 
      res.status(results.statusCode).json(results)
    
  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getListaCategoriaSubAoRiscoId = async function(req, res, next) {
  try{

    logger("SERVIDOR:ClientesId").info("Buscar cliente pelo Id")
    const {id_lista_categoria_sub_de_risco} = req.params

    const results = await models.getListaCategoriaSubAoRiscoId(id_lista_categoria_sub_de_risco);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesId").error(`Erro ao buscar cliente pelo Id ${error.message}`)
  }
    
}

module.exports.getClientesListaCategoriaSubAoRisco = async function(req, res, next) {
  try{
    const {categoria_de_risco_id_fk} = req.params
    const results = await models.getClientesListaCategoriaSubAoRisco(categoria_de_risco_id_fk)
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getClientesCategoriaDefinidoSubAoRisco = async function(req, res, next) {

  try{
    const {categoria_de_risco_id_fk, cliente_categorizado_fk} = req.params
    const results = await models.getClientesCategoriaDefinidoSubAoRisco(categoria_de_risco_id_fk, cliente_categorizado_fk)
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.postListaCategoriaSubAoRisco = async function(req, res, next) { 
    
   try {

      logger("SERVIDOR:postClientes").info(`Iniciando cadastrado o cliente`)

      const dados =  req.body

      const schemaListaCategoriaSubAoRisco = yup.object().shape({
        categoria_de_risco_id_fk: yup.number().required(),
        //cliente_categorizado_fk: yup.number().required(),
        descricao_categoria_sub: yup.string().required(),
      })

      logger("SERVIDOR:postClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaListaCategoriaSubAoRisco.validate(dados)
      
      const result = await models.postListaCategoriaSubAoRisco(validar, req)  
      
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

module.exports.patchListaCategoriaSubAoRisco = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientes").info(`Iniciando actualização do cliente`)
        const {id_lista_categoria_sub_de_risco} = req.params
        const dados = req.body

        const schemaListaCategoriaSubAoRisco = yup.object().shape({
          categoria_de_risco_id_fk: yup.number().required(),
          //cliente_categorizado_fk: yup.number().required(),
          descricao_categoria_sub: yup.string().required(),
        })

        logger("SERVIDOR:patchClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaListaCategoriaSubAoRisco.validate(dados)

        const result = await models.patchListaCategoriaSubAoRisco(id_lista_categoria_sub_de_risco, validar, req)

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

module.exports.deleteListaCategoriaSubAoRisco = async function(req, res, next) {
  try {

      logger("SERVIDOR:deleteClientes").info(`Iniciando a exlusão do cliente`)
      const {id_lista_categoria_sub_de_risco} = req.params
      const result = await models.deleteListaCategoriaSubAoRisco(id_lista_categoria_sub_de_risco, req)

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
