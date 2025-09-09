const models = require('../models/clientes')
const response = require("../constants/response");
const bcrypt = require('bcryptjs');
const path = require('path');
const yup = require('yup')
const {client} = require('../utils/rabbitMQ');
const logger = require('../services/loggerService'); 
const sendRequestOnMicroservices = require("../helpers/sendRequestOnMicroservices"); 
const StrengthSchecker = require('../helpers/StrengthSchecker');


module.exports.getClientes = async function(req, res, next) {
  try{
      logger("SERVIDOR:Clientes").info("Buscar clientes")
      const {pagina, limite, nome_empresa = '', nif = '', email = '', email_2 = '', contacto = '', contacto_2 = ''} = req.query
      const results = await models.getClientes(pagina, limite, nome_empresa, nif, email, email_2, contacto, contacto_2); 
      res.status(results.statusCode).json(results)
    
  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getClientesId = async function(req, res, next) {
  try{

    logger("SERVIDOR:ClientesId").info("Buscar cliente pelo Id")
    const {id_clientes} = req.params

    const results = await models.getClientesID(id_clientes);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesId").error(`Erro ao buscar cliente pelo Id ${error.message}`)
  }
    
}

module.exports.getClientesEntidade = async function(req, res, next) {
  try{
    const {numero_entidade} = req.params
    const results = await models.getClientesEntidade(numero_entidade)
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getClientesHash = async function(req, res, next) {
  try{
    logger("SERVIDOR:ClientesHash").info(`Buscar dados do hash do cliente`)
    const {hash} = req.params
    const results = await models.getClientesHash(hash);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesHash").error(`Erro ao buscar clientes ${error.message}`)
  }
    
}

module.exports.getClientesEmail = async function(req, res, next) {
  try{
    logger("SERVIDOR:ClientesEmail").info(`Buscar dados do percentual de uso`)
    const {email, canal} = req.params
    const results = await models.getClientesEmail(email, canal);
    res.status(results.statusCode).json(results)
    
  } catch (error) {
    console.error(error.message)
    const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
    res.status(rs.statusCode).json(rs)
    logger("SERVIDOR:ClientesEmail").error(`Erro ao buscar percentual de uso ${error.message}`)
  }
    
}

module.exports.recuperarSenha = async function(req, res, next) {
  try{

    logger("SERVIDOR:recuperarSenha").info(`Realizando a recuperação de senha`)
    const {email, canal} = req.body

    const schemaRecuperarSenha = yup.object().shape({
      email: yup.string().min(4).required(),
      canal: yup.mixed().oneOf(['Whatsapp', 'E-mail', 'SMS']).required(), 
    })

    logger("SERVIDOR:recuperarSenha").debug(`Á validar os dados ${JSON.stringify(req.body)}`)
    const validar = await schemaRecuperarSenha.validate(req.body)
    const result = await models.recuperarSenha(validar.email, validar.canal, req)
    
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
    logger("SERVIDOR:recuperarSenha").error(`Erro ao recuperar a senha ${error.message}`)

    if(error?.path){
      const rs = response("erro", 412, error.message);
      res.status(rs.statusCode).json(rs)        
    }else{  
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
    }
  }
    
}

module.exports.redifinirSenha = async function(req, res, next) {
  try{

    logger("SERVIDOR:redifinirSenha").info(`Realizando a redifinição de senha`)
    const dados = req.body

    const schemaRedifinirSenha = yup.object().shape({
      codigo_seguranca: yup.string().min(4).required(),
      entidade: yup.string().min(1).required(), 
    })

    logger("SERVIDOR:redifinirSenha").debug(`Á validar os dados ${JSON.stringify(dados)}`)
    const validar = await schemaRedifinirSenha.validate(dados)
    const result = await models.redifinirSenha(validar.codigo_seguranca, validar.entidade, req);

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
    logger("SERVIDOR:redifinirSenha").error(`Erro ao redifinir a senha ${error.message}`)

    if(error?.path){
      const rs = response("erro", 412, error.message);
      res.status(rs.statusCode).json(rs)        
    }else{  
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
    }
  }
    
}

module.exports.postClientes = async function(req, res, next) { 
    
   try {

      logger("SERVIDOR:postClientes").info(`Iniciando cadastrado o cliente`)

      const dados =  req.body
      const dadosHeader =  req.headers
      const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

      const schemaEntidades = yup.object().shape({
        nome_empresa: yup.string().min(5).required(),
        email: yup.string().email().required(),
        email_2: yup.string().email(),
        senha: yup.string().required(),
        confirmar_senha: yup.string().oneOf([yup.ref("senha")]).required(),
        nif: yup.string().required().trim(),
        contacto: yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
        contacto_2: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
      })

      const schemaEntidadesHeader = yup.object().shape({
        confirmacao: yup.mixed().oneOf(['confirmacaoDeConta', 'confirmacaoDeContaLink'])
      })

      logger("SERVIDOR:postClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaEntidades.validate(dados)
      const validarHeader = await schemaEntidadesHeader.validate(dadosHeader)

      logger("SERVIDOR:postClientes").debug(`Fortificando a senha`)
      const passCheck = await StrengthSchecker(validar.senha)

      if(passCheck.bg === "error"){

        logger("SERVIDOR:postClientes").info(`Senha para o cliente é muito fraca`)         
        const rs = response("erro", 406, "Senha para o cliente é muito fraca");
        res.status(rs.statusCode).json(rs)         

        return
      } 

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(validar.senha, salt);

      if(validar?.nome_empresa){
        validar.nome_empresa = validar.nome_empresa.toUpperCase().trim();
      }
      
      delete validar.confirmar_senha
      // const result = await models.postClientes({...validar, nome_empresa: validar.nome_empresa.toUpperCase().trim(), senha:hash, criado_por: validarHeader.criador}, req)  
      const result = await models.postClientes({...validar, nome_empresa: validar.nome_empresa.toUpperCase().trim(), senha:hash, validacao:validarHeader.confirmacao}, req)  
      
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

module.exports.loginClientes = async function(req, res, next) {
    
   try {

      logger("SERVIDOR:loginClientes").info(`Realizando o login`)
      const dados =  req.body      
      
      const schemaLogin = yup.object().shape({
        email: yup.string().email().required(),
        senha: yup.string().required(),
      })

      logger("SERVIDOR:loginClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaLogin.validate(dados)
      const result = await models.loginClientes(validar, req) 
      
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
      logger("SERVIDOR:loginClientes").error(`Erro ao realizar o login ${error.message}`)

      if(error?.path){
        const rs = response("erro", 412, error.message);
        res.status(rs.statusCode).json(rs)        
      }else{  
        const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
        res.status(rs.statusCode).json(rs)
      }
   }
    
}

module.exports.logoutClientes = async function(req, res, next) {
    
   try {

      logger("SERVIDOR:logoutClientes").info("Realizando o login")
      const dados = req.body      

      const schemaLogout = yup.object().shape({
        entidade: yup.string().required(),
      })

      logger("SERVIDOR:logoutClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaLogout.validate(dados)
      const result = await models.logoutClientes(validar.entidade, req) 
      
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
      

        return result
      
   } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:logoutClientes").error(`Erro ao realizar o logout ${error.message}`)

      if(error?.path){
        const rs = response("erro", 412, error.message);
        res.status(rs.statusCode).json(rs)        
      }else{  
        const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
        res.status(rs.statusCode).json(rs)
      }
   }
    
}

module.exports.comunicarEmail = async function(req, res, next) {
    
   try {
        logger("SERVIDOR:comunicarEmail").info(`Realizando o login`)
        const dados = req.body 

        const schemaEmail = yup.object().shape({
          email: yup.array(yup.string().email().required()).required(),
          assunto: yup.string().required(),
          html: yup.string().required()
        })

        logger("SERVIDOR:comunicarEmail").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEmail.validate(dados)
        const result = await models.comunicarEmail(validar, req) 
        
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
        logger("SERVIDOR:comunicarEmail").error(`Erro ao realizar o email ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
   }
    
}

module.exports.activarPorLInk = async function(req, res, next) {
    
   try {
        logger("SERVIDOR:activarPorLInk").info(`Realizando o login`)
        const dados = req.body 

        const schemaEmail = yup.object().shape({
          link_confirmacao: yup.string().required()
        })

        logger("SERVIDOR:activarPorLInk").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEmail.validate(dados)
        const result = await models.activarPorLInk(validar, req) 
        
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
        logger("SERVIDOR:activarPorLInk").error(`Erro ao realizar o email ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
   }
    
}

module.exports.activarPorCodigo = async function(req, res, next) {
    
   try {
        logger("SERVIDOR:activarPorCodigo").info(`Realizando o login`)
        const dados = req.body 

        const schemaEmail = yup.object().shape({
          codigo_confirmacao: yup.string().required()
        })

        logger("SERVIDOR:activarPorCodigo").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEmail.validate(dados)
        const result = await models.activarPorCodigo(validar, req) 
        
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
        logger("SERVIDOR:activarPorCodigo").error(`Erro ao realizar o email ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
   }
    
}

module.exports.patchClientes = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientes").info(`Iniciando actualização do cliente`)
        const {id_clientes} = req.params
        const dados = req.body
        
        const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

        const schemaEntidades = yup.object().shape({
          nome_empresa: yup.string().min(5),
          email: yup.string().email(),
          email_2: yup.string().email(),
          senha: yup.string(),
          confirmar_senha: yup.string().oneOf([yup.ref("senha")]),
          nif: yup.string().trim(),
          contacto: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
          contacto_2: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        })

        logger("SERVIDOR:patchClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEntidades.validate(dados)
        
        if(Object.keys(validar).includes('senha')){          

          logger("SERVIDOR:patchClientes").debug(`Fortificando a senha`)
          const passCheck = await StrengthSchecker(validar?.senha)
          
          if(passCheck.bg === "error"){

            logger("SERVIDOR:patchClientes").info(`Senha para o cliente é muito fraca`)         
            const rs = response("erro", 406, "Senha para o cliente é muito fraca");
            res.status(rs.statusCode).json(rs)         
  
            return
          }

          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(validar.senha, salt);
          validar.senha = hash

        }
        
        delete validar.confirmar_senha

        if(validar?.nome_empresa){
          validar.nome_empresa = validar.nome_empresa.toUpperCase().trim();
        }

        const result = await models.patchClientes(id_clientes, validar, req)

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

module.exports.patchClientesRedifinirSenha = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientesRedifinirSenha").info(`Iniciando actualização de senha`)
        const {entidade} = req.params
        const dados = req.body

        const schemaEntidades = yup.object().shape({
          senha: yup.string().required(),
          confirmar_senha: yup.string().oneOf([yup.ref("senha")]).required()
        })

        logger("SERVIDOR:patchClientesRedifinirSenha").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEntidades.validate(dados)
        
        if(Object.keys(dados).includes('senha')){          

          logger("SERVIDOR:patchClientesRedifinirSenha").debug(`Fortificando a senha`)
          const passCheck = await StrengthSchecker(validar?.senha)
          
          if(passCheck.bg === "error"){

            logger("SERVIDOR:patchClientesRedifinirSenha").info(`Senha para o cliente é muito fraca`)         
            const rs = response("erro", 406, "Senha para o cliente é muito fraca");
            res.status(rs.statusCode).json(rs)         
  
            return
          }

          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(validar.senha, salt);
          dados.senha = hash

        }
        
        delete validar.confirmar_senha
        const result = await models.patchClientesRedifinirSenha(entidade, validar, req)

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
        logger("SERVIDOR:patchClientesRedifinirSenha").error(`Erro ao actualizar da senha ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
      }
    
}

module.exports.patchClientesTrocarSenhaPadrao = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientesTrocarSenhaPadrao").info(`Iniciando actualização da senha padrão`)
        const {entidade} = req.params
        const dados = req.body

        const schemaEntidades = yup.object().shape({
          senha: yup.string().required(),
          confirmar_senha: yup.string().oneOf([yup.ref("senha")]).required(),
        })

        logger("SERVIDOR:patchClientesTrocarSenhaPadrao").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEntidades.validate(dados)                 

        logger("SERVIDOR:patchClientesTrocarSenhaPadrao").debug(`Fortificando a senha`)
        const passCheck = await StrengthSchecker(validar?.senha)
        
        if(passCheck.bg === "error"){

          logger("SERVIDOR:patchClientesTrocarSenhaPadrao").info(`Senha para o cliente é muito fraca`)         
          const rs = response("erro", 406, "Senha para o cliente é muito fraca");
          res.status(rs.statusCode).json(rs)         

          return
        }

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(validar.senha, salt);
        dados.senha = hash
        
        delete validar.confirmar_senha
        const result = await models.patchClientesTrocarSenhaPadrao(entidade, validar, req)

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
        logger("SERVIDOR:patchClientesTrocarSenhaPadrao").error(`Erro ao actualizar da senha padrão ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
      }
    
}

module.exports.patchClientesVerificarSenhaActual = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientesVerificarSenhaActual").info(`Iniciando actualização da senha padrão`)
        const {entidade} = req.params
        const dados = req.body

        const schemaEntidades = yup.object().shape({
          senha_actual: yup.string().required(),
        })

        logger("SERVIDOR:patchClientesVerificarSenhaActual").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEntidades.validate(dados)
        
        const result = await models.patchClientesVerificarSenhaActual(entidade, validar.senha_actual, req)

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
        logger("SERVIDOR:patchClientesVerificarSenhaActual").error(`Erro ao verificar da senha actual ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
      }
    
}

module.exports.patchClientesAlterarSenha = async function(req, res, next) { 
      try {

        logger("SERVIDOR:patchClientesAlterarSenha").info(`Iniciando actualização da senha padrão`)
        const {entidade} = req.params
        const dados = req.body

        const schemaEntidades = yup.object().shape({
          senha_actual: yup.string().required(),
          senha: yup.string().required(),
          confirmar_senha: yup.string().oneOf([yup.ref("senha")]).required()
        })

        logger("SERVIDOR:patchClientesRedifinirSenha").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaEntidades.validate(dados)
        
        if(Object.keys(dados).includes('senha')){          

          logger("SERVIDOR:patchClientesRedifinirSenha").debug(`Fortificando a senha`)
          const passCheck = await StrengthSchecker(validar?.senha)
          
          if(passCheck.bg === "error"){

            logger("SERVIDOR:patchClientesRedifinirSenha").info(`Senha para o cliente é muito fraca`)         
            const rs = response("erro", 406, "Senha para o cliente é muito fraca");
            res.status(rs.statusCode).json(rs)         
  
            return
          }

          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(validar.senha, salt);
          dados.senha = hash

        }
        
        delete validar.confirmar_senha        
        const result = await models.patchClientesAlterarSenha(entidade, validar.senha_actual, validar.senha, req)

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
        logger("SERVIDOR:patchClientesAlterarSenha").error(`Erro ao verificar da senha actual ${error.message}`)

        if(error?.path){
          const rs = response("erro", 412, error.message);
          res.status(rs.statusCode).json(rs)        
        }else{  
          const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
          res.status(rs.statusCode).json(rs)
        }
      }
    
}

exports.mudarFotoClientes = async function (req, res){
  try {
      
      logger("SERVIDOR:mudarFotoClientes").info(`Iniciando a mudança de imagem`)
      let foto_perfil = '';
      const {entidade} = req.params 
      
      if (req.files && req.files.foto_perfil) {
  
          let targetFile = req.files.foto_perfil
          const ext =  path.extname(targetFile.name)
          const filename = targetFile.md5+ext
          foto_perfil =  filename;  

          
          const extensoesPermitidas = ['.png','.jpg', '.jpeg', '.svg','.gif','.webp']
          
          if(!extensoesPermitidas.includes(ext.toLowerCase())) {
            logger("SERVIDOR:mudarFotoClientes").info("Seu arquivo não é permitido. Tente um desses: '.png','.jpg', '.jpeg', '.svg','.gif','.webp'")
            res.status(406).json({status:'erro',mensagem:"Seu arquivo não é permitido. Tente um desses: '.png','.jpg', '.jpeg', '.svg','.gif','.webp'"})
            return;
          }
          
          logger("SERVIDOR:mudarFotoClientes").debug(`Movendo o arquivo da pasta tmp do sistema para o especifico`)
          targetFile.mv(path.join(__dirname, '../assets/imgs',filename), (err) => {
              
            if (err) {
                logger("SERVIDOR:mudarFotoClientes").info(`Algo aconteceu de errado. Não conseguimos carregar o arquivo`)
                res.status(400).json({status:'erro',mensagem:"Algo aconteceu de errado. Não conseguimos carregar o arquivo"})
                return;
            }
              
          });
          
          logger("SERVIDOR:mudarFotoClientes").info(`Upload feito, Á gravar na base de dados`)
        
          const result = await models.patchClientesFoto(entidade, {logo: foto_perfil}, req)

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

      }else{
            logger("SERVIDOR:mudarFotoClientes").info(`Algo aconteceu de errado. Tente outra vez! Selecionou sua imagem?`)
            const rs = response("erro", 406, `Algo aconteceu de errado. Tente outra vez! Selecionou sua imagem?`);
            res.status(rs.statusCode).json(rs)
      }
              
      
  } catch (error) {
      console.log(error)
      logger("SERVIDOR:mudarFotoClientes").error(`Erro ao mudar a foto do cliente ${error.message}`)

      if(error?.path){
        const rs = response("erro", 412, error.message);
        res.status(rs.statusCode).json(rs)        
      }else{  
        const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
        res.status(rs.statusCode).json(rs)
      }
  }
}

exports.mudarArquivoContratoClientes = async function (req, res){
try {
    
    logger("SERVIDOR:mudarArquivoContratoClientes").info(`Iniciando a mudança do pdf do contrato`)
    let arquivo_contrato = '';
    const {entidade} = req.params 
    
    if (req.files && req.files.arquivo_contrato) {

        let targetFile = req.files.arquivo_contrato
        const ext =  path.extname(targetFile.name)
        const filename = targetFile.md5+ext
        arquivo_contrato =  filename;  

        const extensoesPermitidas = ['.pdf']

        if(!extensoesPermitidas.includes(ext.toLowerCase())) {
          logger("SERVIDOR:mudarArquivoContratoClientes").info("Seu arquivo não é permitido. Tente um desses: '.pdf'")
          res.status(406).json({status:'erro',mensagem:"Seu arquivo não é permitido. Tente um desses: '.pdf'"})
          return;
        }
        
        logger("SERVIDOR:mudarArquivoContratoClientes").debug(`Movendo o arquivo da pasta tmp do sistema para o especifico`)
        targetFile.mv(path.join(__dirname, '../assets/contratos',filename), (err) => {
            
          if (err) {
              logger("SERVIDOR:mudarArquivoContratoClientes").info(`Algo aconteceu de errado. Não conseguimos carregar o arquivo`)
              const rs = response("erro", 400, `Algo aconteceu de errado. Não conseguimos carregar o arquivo`);
              res.status(rs.statusCode).json(rs)
              return;
          }
            
        });
        
        logger("SERVIDOR:mudarArquivoContratoClientes").info(`Upload feito, Á gravar na base de dados`)
      
        const result = await models.patchClientesArquivoContrato(entidade, {arquivo_do_contrato: arquivo_contrato}, req)

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
        
        // 995302104
        
    }else{
          logger("SERVIDOR:mudarArquivoContratoClientes").info(`Algo aconteceu de errado. Tente outra vez! Selecionou seu PDF?`)
          const rs = response("erro", 406, `Algo aconteceu de errado. Tente outra vez! Selecionou seu PDF?`);
          res.status(rs.statusCode).json(rs)
    }
        
        
} catch (error) {
    console.log(error)
    logger("SERVIDOR:patchClientesArquivoContrato").error(`Erro ao mudar o arquivo de contrato do cliente ${error.message}`)

    if(error?.path){
      const rs = response("erro", 412, error.message);
      res.status(rs.statusCode).json(rs)        
    }else{  
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
    }
}
}

module.exports.patchClientesBloquear = async function(req, res, next) {

      try {

        logger("SERVIDOR:patchClientesBloquear").info(`Iniciando o bloqueio de cliente`)
        const {id_clientes} = req.params
        const result = await models.patchClientesBloquear(id_clientes, req)

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
        logger("SERVIDOR:patchClientesBloquear").error(`Erro ao bloquear o cliente ${error.message}`)
      }
    
}

module.exports.patchClientesDesbloquear = async function(req, res, next) {  
      try {

        logger("SERVIDOR:patchClientesDesbloquear").info(`Iniciando o desbloqueio de cliente`)
        const {id_clientes} = req.params
        const result = await models.patchClientesDesbloquear(id_clientes, req)

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
        logger("SERVIDOR:patchClientesDesbloquear").error(`Erro ao desbloquear o cliente ${error.message}`)
      }
    
}

module.exports.configurarReporClientes = async function(req, res, next) {  
      try {

          logger("SERVIDOR:configurarReporClientes").info(`Iniciando a reposição do cliente`)
          const {id_clientes} = req.params
          const dados = req.body

          const schemaReporClientes = yup.object().shape({
            tentativas_login: yup.number().max(5)
          })

          logger("SERVIDOR:configurarReporClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
          const validar = await schemaReporClientes.validate(dados)

          const result = await models.configurarReporClientes(id_clientes, validar.tentativas_login, req)

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
          logger("SERVIDOR:configurarReporClientes").error(`Erro ao repor o cliente ${error.message}`)

          if(error?.path){
            const rs = response("erro", 412, error.message);
            res.status(rs.statusCode).json(rs)        
          }else{  
            const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
            res.status(rs.statusCode).json(rs)
          }
      }
    
}

module.exports.deleteClientes = async function(req, res, next) {
  try {

      logger("SERVIDOR:deleteClientes").info(`Iniciando a exlusão do cliente`)
      const {id_clientes} = req.params
      const result = await models.deleteClientes(id_clientes, req)

      var wk = result.webhook
      var lg = result.logs
      var nt = result.notification
      
      delete result.webhook
      delete result.logs
      delete result.notification
      
      res.status(result.statusCode).json(result)
      if(result.status == "sucesso"){

        if(result?.gpo_comerciante_hash){

            const queue = 'reference-entities';   
            const channel = await client.rabbitMQ.createChannel() 
            await channel.assertQueue(queue)
            const payload = JSON.stringify({
              kind: "entities:deleted",
              body:{
                "public_id": result.gpo_comerciante_hash
              }
            })
            channel.sendToQueue(queue, Buffer.from(payload));
            console.log("Deletar Clientes: Enviado para fila")
        }
      
        sendRequestOnMicroservices({lg, nt, wk})
      }
          

  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:deleteClientes").error(`Erro ao deletar o cliente ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}