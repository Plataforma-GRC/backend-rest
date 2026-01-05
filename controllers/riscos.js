const models = require('../models/riscos')
const response = require("../constants/response");
const yup = require('yup')
const logger = require('../services/loggerService'); 
const sendRequestOnMicroservices = require("../helpers/sendRequestOnMicroservices"); 


module.exports.getRiscos = async function(req, res, next) {
  try{
      logger("SERVIDOR:Clientes").info("Buscar clientes")
      const {pagina, limite, codigo_risco = '', titulo = '', descricao_risco = '', causa = '', consequencia = '', score = '', responsavel = '', status_riscos = '', risco_time = ''} = req.query
      const results = await models.getRiscos(pagina, limite, codigo_risco, titulo, descricao_risco, causa, consequencia, score, responsavel, status_riscos, risco_time); 
      res.status(results.statusCode).json(results)
    
  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getRiscosId = async function(req, res, next) {
  try{

    logger("SERVIDOR:ClientesId").info("Buscar cliente pelo Id")
    const {riscos_id} = req.params

    const results = await models.getRiscosId(riscos_id);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesId").error(`Erro ao buscar cliente pelo Id ${error.message}`)
  }
    
}

module.exports.getClientesRiscos = async function(req, res, next) {
  try{
    const {empresa_id} = req.params
    const results = await models.getClientesRiscos(empresa_id)
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.postRiscos = async function(req, res, next) { 
    
   try {

      logger("SERVIDOR:postClientes").info(`Iniciando cadastrado o cliente`)

      const dados =  req.body

      const schemaRiscos = yup.object().shape({
        empresa_id: yup.number().required(),
        titulo: yup.string().required(),
        departamento_organizacional_id: yup.number().required(),
        descricao_risco: yup.string().required(),
        categoria_risco_fk_id: yup.number().required(),
        categora_sub_risco_fk_id: yup.number().required(),
        fonte: yup.string().required(),
        causa: yup.string().required(),
        consequencia: yup.string().required(),
        score: yup.string().required(),
        niveis_aceitacao_id: yup.number().required(),
        probabilidade: yup.number().required(),
        impacto: yup.number().required(),
        //niveis_resudual_idd: yup.number().required(),
        apetite_risco_id: yup.number().required(),
        arquivo_de_evidencias: yup.string(),
        responsavel: yup.string().required(),
        status_riscos: yup.mixed().oneOf(['Identificado','Avaliado','Mitigado','Aceito','Encerrado','Em Avaliação','Em Execução']).required(),
      })

      logger("SERVIDOR:postClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaRiscos.validate(dados)
      
      const result = await models.postRiscos(validar, req)  
      
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

module.exports.patchRiscos = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientes").info(`Iniciando actualização do cliente`)
        const {riscos_id} = req.params
        const dados = req.body

        const schemaRiscos = yup.object().shape({
          empresa_id: yup.string(),
          titulo: yup.string(),
          departamento_organizacional_id: yup.number(),
          descricao_risco: yup.string(),
          categoria_risco_fk_id: yup.number(),
          risco_escala_mtx_id_fk: yup.number(),
          fonte: yup.string(),
          causa: yup.string(),
          consequencia: yup.string(),
          score: yup.string(),
          niveis_aceitacao_id: yup.number(),
          probabilidade: yup.number(),
          impacto: yup.number(),
          niveis_resudual_idd: yup.number(),
          apetite_risco_id: yup.number(),
          arquivo_de_evidencias: yup.string(),
          responsavel: yup.string(),
          status_riscos: yup.mixed().oneOf(['Identificado','Avaliado','Mitigado','Aceito','Encerrado','Em Avaliação','Em Execução']),
        })

        logger("SERVIDOR:patchClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaRiscos.validate(dados)

        const result = await models.patchRiscos(riscos_id, validar, req)

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

module.exports.deleteRiscos = async function(req, res, next) {
  try {

      logger("SERVIDOR:deleteClientes").info(`Iniciando a exlusão do cliente`)
      const {riscos_id} = req.params
      const result = await models.deleteRiscos(riscos_id, req)

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
