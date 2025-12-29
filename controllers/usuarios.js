const models = require('../models/usuarios')
const bcrypt = require('bcryptjs');
const yup = require('yup')
const logger = require('../services/loggerService'); 
const response = require("../constants/response");
const sendRequestOnMicroservices = require("../helpers/sendRequestOnMicroservices"); 
const StrengthSchecker = require('../helpers/StrengthSchecker');

module.exports.getUsuarios = async function(req, res, next) { 
  try {  
      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const {pagina, limite, total_registros, primeiro_nome_usuario = '', segundo_nome_usuario = '', email = '', acesso = '', tipo_usuario = '', cadastrado_em = ''} = req.query
      const results = await models.getUsuarios(pagina, limite, total_registros, primeiro_nome_usuario, segundo_nome_usuario, email , acesso, tipo_usuario, cadastrado_em)
      res.status(results.statusCode).json(results)

  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:getAfiliados").error(`Erro buscar afiliados ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getUsuariosId = async function(req, res, next) {
  try {  

      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const {id_usuarios} = req.params
      const results = await models.getUsuariosId(id_usuarios)
      res.status(results.statusCode).json(results)

  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:getAfiliados").error(`Erro buscar afiliados ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getUsuariosClintes = async function(req, res, next) {
  try {  

      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const {usuario_empresa_fk} = req.params
      const results = await models.getUsuariosClintes(usuario_empresa_fk)
      res.status(results.statusCode).json(results)

  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:getAfiliados").error(`Erro buscar afiliados ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getUsuariosHash = async function(req, res, next) {
  try {  

      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const {hash} = req.params
      const results = await models.getUsuariosHash(hash)
      res.status(results.statusCode).json(results)

  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:getAfiliados").error(`Erro buscar afiliados ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.getUsuariosPermissoes = async function(req, res, next) {
  try {  

      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const {id_usuarios} = req.params
      const {pagina, limite, total_registros, nome_usuario = '', email = '', tipo_nome_usuario = ''} = req.query
      const results = await models.getUsuariosPermissoes(id_usuarios, pagina, limite, total_registros, nome_usuario, email , tipo_nome_usuario)
      res.status(results.statusCode).json(results)

  } catch (error) {
      console.error(error.message)
      logger("SERVIDOR:getAfiliados").error(`Erro buscar afiliados ${error.message}`)
      const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
      res.status(rs.statusCode).json(rs)
  }
    
}

module.exports.postUsuarios = async function(req, res, next) {
  try {

      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const dados = req.body
      const headers = req.headers
      
      const schemaUsuario = yup.object().shape({
        email_: yup.string().email().required(),
        senha_: yup.string().required(),
        confirmar_senha: yup.string().oneOf([yup.ref("senha_")]).required(),
        primeiro_nome_usuario: yup.string().min(3).required(),
        segundo_nome_usuario: yup.string().min(3).required(),
        tipo_usuario: yup.number().required(),
        usuario_empresa_fk: yup.number().required(),
      }) 

      const schemaUsuarioHeader = yup.object().shape({
        gerador: yup.number().required(),
      }) 

      logger("SERVIDOR:postAfiliados").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaUsuario.validate(dados)
      const validarHeaders = await schemaUsuarioHeader.validate(headers)

      logger("SERVIDOR:postAfiliados").debug(`Fortificando a senha`)
      const passCheck = await StrengthSchecker(validar.senha_)

      if(passCheck.bg === "error"){

        logger("SERVIDOR:postAfiliados").info(`Senha para o cliente é muito fraca`)         
        const rs = response("erro", 406, "Senha para o cliente é muito fraca");
        res.status(rs.statusCode).json(rs)         

        return
      }

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(validar.senha_, salt);
      
      delete validar.confirmar_senha
      delete validar.senha_
      
      const result = await models.postUsuarios({...validar, gerado_por: validarHeaders.gerador, senha_:hash}, req)

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

module.exports.postUsuariosLogin = async function(req, res, next) {
  try {

      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const dados = req.body
      const schemaUsuario = yup.object().shape({
        email: yup.string().email().required(),
        senha: yup.string().required()
      }) 

      logger("SERVIDOR:postAfiliados").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaUsuario.validate(dados)

      const result = await models.postUsuariosLogin({email_:validar.email, senha_: validar.senha}, req)

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

module.exports.postUsuariosLogout = async function(req, res, next) {
  try {

      logger("SERVIDOR:").info(`Buscar os afiliados`)
      const dados = req.body
      const schemaUsuario = yup.object().shape({
        id_usuarios: yup.number().required()
      }) 

      logger("SERVIDOR:postAfiliados").debug(`Á validar os dados ${JSON.stringify(dados)}`)
      const validar = await schemaUsuario.validate(dados)

      const result = await models.postUsuariosLogout(validar.id_usuarios, req)

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

module.exports.patchUsuariosPermissoes = async function(req, res, next) {
    try {  

        logger("SERVIDOR:").info(`Buscar os afiliados`)
        const {id_usuarios, permissoes_usuarios} = req.params
        const dados = req.body

        const schemaPermissoesUsuarios = yup.object().shape({
            todas_areas: yup.mixed().oneOf(['true', 'false']),
            pagina_entidades: yup.mixed().oneOf(['true', 'false']),
            pagina_entidades_add: yup.mixed().oneOf(['true', 'false']),
            pagina_entidades_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_entidades_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_entidades_details: yup.mixed().oneOf(['true', 'false']),
            pagina_entidades_block: yup.mixed().oneOf(['true', 'false']),
            pagina_contabilistico: yup.mixed().oneOf(['true', 'false']),
            pagina_contabilistico_details: yup.mixed().oneOf(['true', 'false']),
            pagina_contabilistico_more: yup.mixed().oneOf(['true', 'false']),
            pagina_relatorio: yup.mixed().oneOf(['true', 'false']),
            pagina_relatorio_add: yup.mixed().oneOf(['true', 'false']),
            pagina_relatorio_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_relatorio_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_relatorio_details: yup.mixed().oneOf(['true', 'false']),
            pagina_servico_api: yup.mixed().oneOf(['true', 'false']),
            pagina_faq: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_add: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_details: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_permissions: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_permissions_save: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_groups: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_groups_add: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_groups_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_groups_details: yup.mixed().oneOf(['true', 'false']),
            pagina_afiliado_groups_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_whatsapp: yup.mixed().oneOf(['true', 'false']),
            pagina_whatsapp_add: yup.mixed().oneOf(['true', 'false']),
            pagina_whatsapp_details: yup.mixed().oneOf(['true', 'false']),
            pagina_whatsapp_send: yup.mixed().oneOf(['true', 'false']),
            pagina_email: yup.mixed().oneOf(['true', 'false']),
            pagina_email_add: yup.mixed().oneOf(['true', 'false']),
            pagina_email_send: yup.mixed().oneOf(['true', 'false']),
            pagina_email_details: yup.mixed().oneOf(['true', 'false']),
            pagina_sms: yup.mixed().oneOf(['true', 'false']),
            pagina_sms_add: yup.mixed().oneOf(['true', 'false']),
            pagina_sms_send: yup.mixed().oneOf(['true', 'false']),
            pagina_sms_details: yup.mixed().oneOf(['true', 'false']),
            pagina_token: yup.mixed().oneOf(['true', 'false']),
            pagina_token_add: yup.mixed().oneOf(['true', 'false']),
            pagina_token_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_token_details: yup.mixed().oneOf(['true', 'false']),
            pagina_token_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_token_desative: yup.mixed().oneOf(['true', 'false']),
            pagina_webwook:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_details:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_resend:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_retry:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_retry_details:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_enpoint_add:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_enpoint_edit:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_enpoint_delete:  yup.mixed().oneOf(['true', 'false']),
            pagina_webwook_enpoint_details:  yup.mixed().oneOf(['true', 'false']),
            pagina_notificacao: yup.mixed().oneOf(['true', 'false']),
            pagina_notificacao_details: yup.mixed().oneOf(['true', 'false']),
            pagina_notificacao_move: yup.mixed().oneOf(['true', 'false']),
            pagina_perfil: yup.mixed().oneOf(['true', 'false']),
            pagina_perfil_save: yup.mixed().oneOf(['true', 'false']),
            pagina_perfil_downlod_contract: yup.mixed().oneOf(['true', 'false']),
            pagina_pagamentos_online: yup.mixed().oneOf(['true', 'false']),
            pagina_pagamentos_online_details: yup.mixed().oneOf(['true', 'false']),
            pagina_relatorios_online: yup.mixed().oneOf(['true', 'false']),
            pagina_relatorios_online_details: yup.mixed().oneOf(['true', 'false']),
            pagina_sair: yup.mixed().oneOf(['true', 'false']),
            pagina_usuarios: yup.mixed().oneOf(['true', 'false']),
            pagina_usuarios_add: yup.mixed().oneOf(['true', 'false']),
            pagina_usuarios_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_usuarios_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_usuarios_details: yup.mixed().oneOf(['true', 'false']),
            pagina_usuarios_block: yup.mixed().oneOf(['true', 'false']),
            pagina_usuarios_permissions: yup.mixed().oneOf(['true', 'false']),
            pagina_fmovs: yup.mixed().oneOf(['true', 'false']),
            pagina_fmovs_details: yup.mixed().oneOf(['true', 'false']),
            pagina_fmovs_download: yup.mixed().oneOf(['true', 'false']),
            pagina_comprovantes: yup.mixed().oneOf(['true', 'false']),
            pagina_comprovantes_details: yup.mixed().oneOf(['true', 'false']),
            pagina_comprovantes_download: yup.mixed().oneOf(['true', 'false']),
            pagina_custo_uso: yup.mixed().oneOf(['true', 'false']),
            pagina_custo_uso_details: yup.mixed().oneOf(['true', 'false']),
            pagina_custo_uso_more: yup.mixed().oneOf(['true', 'false']),
            pagina_custo_uso_options: yup.mixed().oneOf(['true', 'false']),
            pagina_transacoes: yup.mixed().oneOf(['true', 'false']),
            pagina_transacoes_details: yup.mixed().oneOf(['true', 'false']),
            pagina_transacoes_filters: yup.mixed().oneOf(['true', 'false']),
            pagina_transacoes_resend: yup.mixed().oneOf(['true', 'false']),
            pagina_sessao: yup.mixed().oneOf(['true', 'false']),
            pagina_sessao_details: yup.mixed().oneOf(['true', 'false']),
            pagina_sessao_reset: yup.mixed().oneOf(['true', 'false']),
            pagina_sessao_block: yup.mixed().oneOf(['true', 'false']),
            pagina_integracao: yup.mixed().oneOf(['true', 'false']),
            pagina_integracao_block: yup.mixed().oneOf(['true', 'false']),
            pagina_integracao_permission_ip: yup.mixed().oneOf(['true', 'false']),
            pagina_tipo_pagamentos: yup.mixed().oneOf(['true', 'false']),
            pagina_tipo_pagamentos_add: yup.mixed().oneOf(['true', 'false']),
            pagina_tipo_pagamentos_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_tipo_pagamentos_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_tipo_pagamentos_details: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_parameter: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_parameter_add: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_parameter_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_parameter_details: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_parameter_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_pag: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_pag_sector: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_pag_sector_block: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_pag_gpo: yup.mixed().oneOf(['true', 'false']),
            pagina_servicos_pag_gpo_block: yup.mixed().oneOf(['true', 'false']),
            pagina_referencia: yup.mixed().oneOf(['true', 'false']),
            pagina_referencia_add: yup.mixed().oneOf(['true', 'false']),
            pagina_referencia_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_referencia_details: yup.mixed().oneOf(['true', 'false']),
            pagina_referencia_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_referencia_block: yup.mixed().oneOf(['true', 'false']),
            pagina_pagamento: yup.mixed().oneOf(['true', 'false']),
            pagina_pagamento_details: yup.mixed().oneOf(['true', 'false']),
            pagina_pagamento_filters: yup.mixed().oneOf(['true', 'false']),
            pagina_pagamento_resend: yup.mixed().oneOf(['true', 'false']),
            pagina_transacoes_percentual: yup.mixed().oneOf(['true', 'false']),
            pagina_transacoes_percentual_alter: yup.mixed().oneOf(['true', 'false']),
            pagina_transacoes_percentual_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_sms_notify: yup.mixed().oneOf(['true', 'false']),
            pagina_sms_notify_add: yup.mixed().oneOf(['true', 'false']),
            pagina_sms_notify_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_sms_notify_block: yup.mixed().oneOf(['true', 'false']),
            pagina_permissoes: yup.mixed().oneOf(['true', 'false']),
            pagina_permissoes_add: yup.mixed().oneOf(['true', 'false']),
            pagina_permissoes_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_permissoes_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_requisicoes: yup.mixed().oneOf(['true', 'false']),
            pagina_requisicoes_details: yup.mixed().oneOf(['true', 'false']),
            pagina_req_geral: yup.mixed().oneOf(['true', 'false']),
            pagina_terminal: yup.mixed().oneOf(['true', 'false']),
            pagina_terminal_add: yup.mixed().oneOf(['true', 'false']),
            pagina_terminal_edit: yup.mixed().oneOf(['true', 'false']),
            pagina_terminal_delete: yup.mixed().oneOf(['true', 'false']),
            pagina_terminal_block: yup.mixed().oneOf(['true', 'false']),
        })      
    
        logger("SERVIDOR:patchAfiliadosPermissoes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaPermissoesUsuarios.validate(dados)
        
        const result = await models.patchUsuariosPermissoes(id_usuarios, permissoes_usuarios, validar, req)

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

module.exports.patchUsuarios = async function(req, res, next) {
    try {  

        logger("SERVIDOR:").info(`Buscar os afiliados`)
        const {id_usuarios} = req.params
        const dados = req.body

        const schemaUsuario = yup.object().shape({
          email_: yup.string().email().required(),
          senha_: yup.string(),
          confirmar_senha: yup.string().oneOf([yup.ref("senha")]),
          primeiro_nome_usuario: yup.string().min(3).required(),
          segundo_nome_usuario: yup.string().min(3).required(),
          tipo_usuario: yup.number().required(),
          usuario_empresa_fk: yup.number().required(),
        })

        logger("SERVIDOR:patchClientes").debug(`Á validar os dados ${JSON.stringify(dados)}`)
        const validar = await schemaUsuario.validate(dados)
        
        if(Object.keys(validar).includes('senha_')){

          logger("SERVIDOR:patchClientes").debug(`Fortificando a senha`)
            const passCheck = await StrengthSchecker(validar?.senha_)
            
            if(passCheck.bg === "error"){

              logger("SERVIDOR:patchClientes").info(`Senha para o cliente é muito fraca`)         
              const rs = response("erro", 406, "Senha para o cliente é muito fraca");
              res.status(rs.statusCode).json(rs)         
    
              return
            }

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(validar.senha_ ? validar.senha_ : "1234", salt);
            validar.senha_ = hash
        }

        delete validar.confirmar_senha
        
        const result = await models.patchUsuarios(id_usuarios, validar, req)

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

module.exports.deleteUsuarios = async function(req, res, next) {
    try {  

        logger("SERVIDOR:").info(`Buscar os afiliados`)
        const {id_usuarios} = req.params
        const result = await models.deleteUsuarios(id_usuarios, req)

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
        logger("SERVIDOR:getAfiliados").error(`Erro buscar afiliados ${error.message}`)
        const rs = response("erro", 400, `Algo aconteceu. Tente de novo, ${error.message}`);
        res.status(rs.statusCode).json(rs)
    }
}