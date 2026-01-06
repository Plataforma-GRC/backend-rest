const database = require('../config/database')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres, clientesFrameworksFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getClientes = async function(pagina, limite, nome_empresa, nif, email, email_2, contacto, contacto_2, cliente_time) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('clientes')
      .whereLike("nome_empresa",`%${String(nome_empresa).toUpperCase()}%`)
      .whereLike("nif",`%${nif}%`)
      .whereLike("email",`%${email}%`)
      .whereLike("email_2",`%${email_2}%`)
      .whereLike("contacto",`%${contacto}%`)
      .whereLike("contacto_2",`%${contacto_2}%`)
      .whereLike("cliente_time",`%${cliente_time}%`)
      .orderBy('id_clientes','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('clientes')
      .whereLike("nome_empresa",`%${String(nome_empresa).toUpperCase()}%`)
      .whereLike("nif",`%${nif}%`)
      .whereLike("email",`%${email}%`)
      .whereLike("email_2",`%${email_2}%`)
      .whereLike("contacto",`%${contacto}%`)
      .whereLike("contacto_2",`%${contacto_2}%`)
      .whereLike("cliente_time",`%${cliente_time}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_clientes','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.nome_empresa = nome_empresa
      registros.nif = nif
      registros.email = email
      registros.email_2 = email_2
      registros.contacto = contacto
      registros.contacto_2 = contacto_2
      registros.cliente_time = cliente_time

      logger("SERVIDOR:Clientes").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, filtered, "json", { registros });
      return rs


  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesID = async function(id_clientes) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [clientes] = await database('clientes')
      .where({id_clientes})
      .orderBy('id_clientes','DESC')
      
      delete clientes?.senha
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, clientes || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesIdFrameworks = async function(id_clientes) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [clientes] = await database('clientes')
      .where({id_clientes})
      .orderBy('id_clientes','DESC')
      
      delete clientes?.senha
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, clientes || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesEntidade = async function(id_clientes) {
  try {

      logger("SERVIDOR:getClientesEntidade").debug("Á buscar os dados")
      const clientes = await database('clientes')
      .join('usuarios',"usuarios.id_usuarios","=","clientes.criado_por")
      .join('configuracoes',"configuracoes.cliente","=","clientes.id_clientes")
      .where({id_clientes})
      .orderBy('id_clientes','DESC')  
    
      logger("SERVIDOR:getClientesEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, clientes, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getClientesEntidade").error(`Erro ao buscar clientes por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesHash = async function(hash) {
  try {

      logger("SERVIDOR:ClientesHash").debug("Verificar se existencia do cliente")
      const result  = await database('clientes')
      .where({hash_autenticador:hash})
      .andWhere({bloqueio: '0'});

      if(!result.length){
        logger("SERVIDOR:ClientesHash").info("Cliente está bloqueado")
        const rs = response("erro", 403, "Cliente está bloqueado");
        return rs

      }else{

        logger("SERVIDOR:ClientesHash").debug("Buscar a configuração do cliente")
        const [verifivarPagamentoTempoReal] = await database('configuracoes').where({cliente: result[0].id_clientes}) 

        if(verifivarPagamentoTempoReal?.tentativas_login > 0){

          logger("SERVIDOR:ClientesHash").debug("Selecionar da base de dados")
          const [clientes] = await database('clientes')
          .join('configuracoes',"configuracoes.cliente","=","clientes.id_clientes")
          .where({hash_autenticador:hash})
          .orderBy('id_clientes','DESC')  
        
          logger("SERVIDOR:ClientesHash").info("Respondeu a solicitação")
          
          delete clientes?.senha
          const rs = response("sucesso", 200, clientes, "json");          
          return rs

        }else{
          logger("SERVIDOR:ClientesHash").warn("Cliente está bloqueiado")
          const rs = response("erro", 403, "Seu perfil se encontra bloqueado. Por favor entre em contacto com administrador");
          return rs
        }

      }

  } catch (erro) { 
      console.log(erro)
      logger("SERVIDOR:ClientesHash").error(`Erro ao buscar clientes por hash ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesEmail = async function(email) { 
  try {

      logger("SERVIDOR:ClientesEmail").debug("Verificar se existencia do cliente")
      const clientes = await database('clientes')
      .join('usuarios',"usuarios.id_usuarios","=","clientes.criado_por")
      .join('configuracoes',"configuracoes.cliente","=","clientes.id_clientes")
      .where({email})
      .orderBy('id_clientes','DESC')
    
      logger("SERVIDOR:ClientesEmail").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, clientes, "json");          
      return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:ClientesEmail").error(`Erro ao buscar cliente ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.getClientesFrameworks = async function(pagina, limite, nome_empresa, nif, email, email_2, contacto, contacto_2, cliente_time) {
  try {

      const clientes = await database('clientes')
      .join("clientes_frameworks","clientes_frameworks.clientes_id_fk","=","clientes.id_clientes")
      .join("framework","framework.framework_id","=","clientes_frameworks.frameworks_id_fk")
      .whereLike("nome_empresa",`%${String(nome_empresa).toUpperCase()}%`)
      .whereLike("nif",`%${nif}%`)
      .whereLike("email",`%${email}%`)
      .whereLike("email_2",`%${email_2}%`)
      .whereLike("contacto",`%${contacto}%`)
      .whereLike("contacto_2",`%${contacto_2}%`)
      .whereLike("cliente_time",`%${cliente_time}%`)
      .orderBy('id_clientes','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('clientes')
      .join("clientes_frameworks","clientes_frameworks.clientes_id_fk","=","clientes.id_clientes")
      .join("framework","framework.framework_id","=","clientes_frameworks.frameworks_id_fk")
      .whereLike("nome_empresa",`%${String(nome_empresa).toUpperCase()}%`)
      .whereLike("nif",`%${nif}%`)
      .whereLike("email",`%${email}%`)
      .whereLike("email_2",`%${email_2}%`)
      .whereLike("contacto",`%${contacto}%`)
      .whereLike("contacto_2",`%${contacto_2}%`)
      .whereLike("cliente_time",`%${cliente_time}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_clientes','DESC')


      const clientesAll = await database('clientes')

      const filtered = clientesFrameworksFilteres(clientesAll, clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.nome_empresa = nome_empresa
      registros.nif = nif
      registros.email = email
      registros.email_2 = email_2
      registros.contacto = contacto
      registros.contacto_2 = contacto_2
      registros.cliente_time = cliente_time

      logger("SERVIDOR:Clientes").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, filtered, "json", { registros });
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesFrameworksId = async function(id_clientes) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [clientes] = await database('clientes')
      .where({id_clientes})
      .orderBy('id_clientes','DESC')
      
      delete clientes?.senha
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, clientes || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.recuperarSenha = async function(email, canal, req) {
  try {

    logger("SERVIDOR:recuperarSenha").debug(`Verificar a existencia do cliente pelo email ${email}`)
    const clientes = await database('clientes')
    .where({email})
    .orWhere({contacto: email})
    .orderBy('id_clientes','DESC')
    
    logger("SERVIDOR:recuperarSenha").debug(`Gerando um codigo de 6 digitos`)
    let codigo_seguranca = `${Math.random()}`.replace(".","").substring(1,7)
    
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000*60*10;
    
    let tempo_de_vida_codigo_seguranca = expireTime;
    
    logger("SERVIDOR:recuperarSenha").info(`Codigo gerado: ${codigo_seguranca} para ${tempo_de_vida_codigo_seguranca} de vida util`)
    if(clientes.length > 0) {

      logger("SERVIDOR:recuperarSenha").debug(`Verficar duplicidade de codigo`)
      const codigounico = await database('configuracoes').where({codigo_seguranca})
      
      logger("SERVIDOR:recuperarSenha").debug(`Gerar outro codigo`)
      while(codigounico.length > 0) {
          codigo_seguranca = `${Math.random()}`.replace(".","").substring(1,7)
      }
      
      logger("SERVIDOR:recuperarSenha").debug(`Actualizando e gravando na base de dados`)
      await database('configuracoes').where({cliente: clientes[0].id_clientes}).update({codigo_seguranca, tempo_de_vida_codigo_seguranca})
      
      
        if(canal === "Whatsapp") {
            logger("SERVIDOR:recuperarSenha").info(`Enviamos um codigo de segurança para o seu ${canal}. Por favor verifique`)
            const rs = response("sucesso", 202, `Enviamos um codigo de segurança para o seu ${canal}. Por favor verifique`, 'json',{
              notification: {efeito: {contacto: clientes[0].contacto, id_clientes: clientes[0].id_clientes, email: clientes[0].email, codigo_seguranca }, para:"codigoSeguranca", mensagem: 'null', canal:"whatsapp"},
              info: {entidade:clientes[0].id_clientes, tempo_de_vida_codigo_seguranca, email: clientes[0].email},
              logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "SENDSECURITYCODE" , tabela: "CLIENTES", informacao: {email, tempo_de_vida_codigo_seguranca, codigo_seguranca, canal}, entidade: clientes[0].id_clientes}
            });
            return rs
        }
        else if(canal === "E-mail") {

            logger("SERVIDOR:recuperarSenha").info(`Enviamos um codigo de segurança para o seu ${canal}. Por favor verifique`)
            const rs = response("sucesso", 202, `Enviamos um codigo de segurança para o seu ${canal}. Por favor verifique`, 'json',{
              notification: {efeito: {empresa: clientes[0].nome_empresa, email, codigo_seguranca }, para:"codigoSeguranca", mensagem: 'null', canal:"email"},
              info: {entidade:clientes[0].id_clientes, tempo_de_vida_codigo_seguranca, email: clientes[0].email},
              logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "SENDSECURITYCODE" , tabela: "CLIENTES", informacao: {email, tempo_de_vida_codigo_seguranca, codigo_seguranca, canal}, entidade: clientes[0].id_clientes}
            });
            return rs
        }
        else if(canal.toUpperCase() === "SMS") {
            
            logger("SERVIDOR:recuperarSenha").info(`Caro(a) cliente, realizou em pedido de alteração de sua senha. O codigo é:  ${codigo_seguranca}`)
            const mensagem = `Caro(a) cliente, realizou em pedido de alteração de sua senha. O codigo é:  ${codigo_seguranca}`;
            const rs = response("sucesso", 202, `Enviamos um codigo de segurança para o seu ${canal}. Por favor verifique`, 'json',{
              notification: {efeito: {...clientes[0]}, para:"RECUPERACAO", mensagem, canal:"sms"},
              info: {entidade:clientes[0].id_clientes, tempo_de_vida_codigo_seguranca, email: clientes[0].email},
              logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "SENDSECURITYCODE" , tabela: "CLIENTES", informacao: {email, tempo_de_vida_codigo_seguranca, codigo_seguranca, canal}, entidade: clientes[0].id_clientes}
            });
            return rs
        }
        else{
            logger("SERVIDOR:recuperarSenha").info(`Não conseguimos enviar o codigo de segurança para o seu ${canal}`)
            const rs = response("erro", 406, `Não conseguimos enviar o codigo de segurança para o seu ${canal}`);
            return rs 
        }
        
    }else{
    
      logger("SERVIDOR:recuperarSenha").info(`Não conseguimos seu E-mail nos nossos registros`)
      const rs = response("erro", 409, 'Não conseguimos seu E-mail nos nossos registros');
      return rs             
      
    }    
    
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:recuperarSenha").error(`Erro ao recuperar a senha ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs 
  }
    
}

module.exports.redifinirSenha = async function(codigo_seguranca, entidade, req) {
  try {

    logger("SERVIDOR:redifinirSenha").debug(`Verificar o codigo de segurança`)
    const codigo = await database('configuracoes').where({codigo_seguranca}).andWhere({cliente: entidade})
    
    if(codigo.length > 0) {
    
      var now = new Date();
      var time = now.getTime();
      
      if(time > codigo[0].tempo_de_vida_codigo_seguranca){
        logger("SERVIDOR:redifinirSenha").info(`Codigo de segurança expirado. Por favor repita os passos novamente`)
        const rs = response("erro", 406, 'Codigo de segurança expirado. Por favor repita os passos novamente!','json',{
          logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "SECURITYCODEEXPIRE" , tabela: "CLIENTES", informacao: {tempo_de_vida_codigo_seguranca: codigo[0].tempo_de_vida_codigo_seguranca, codigo_seguranca}, entidade: entidade}
        });
        return rs
      }
      
      logger("SERVIDOR:redifinirSenha").debug(`Buscar dado recente do cliente na base de dados`)
      const cliente = await database('clientes').where({id_clientes: entidade}).orderBy('id_clientes','DESC')

      logger("SERVIDOR:redifinirSenha").debug(`Actualizar o codigo de segurança para 0000`)
      await database('configuracoes').andWhere({cliente: entidade}).update({codigo_seguranca:"0000"}) 
      
      if(codigo_seguranca != "0000"){
        logger("SERVIDOR:redifinirSenha").debug(`Actualizar e resetar as ${process.env.LIMITE_TENTATIVAS_LOGIN} tentativas`)
        await database('configuracoes').where({cliente: cliente[0].id_clientes}).update({tentativas_login: process.env.LIMITE_TENTATIVAS_LOGIN})

        logger("SERVIDOR:redifinirSenha").info(`Codigo de segurança verificado`)
        const rs = response("sucesso", 202, 'Codigo de segurança verificado!','json',{
          info: {codigo_entidade:entidade},
          logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "SECURITYCODEUSED" , tabela: "CLIENTES", informacao: {tempo_de_vida_codigo_seguranca: codigo[0].tempo_de_vida_codigo_seguranca, codigo_seguranca}, entidade: entidade}
        });
        return rs
      }

      logger("SERVIDOR:redifinirSenha").info(`Codigo de segurança invalido. Coloque a sequencia correctamente`)
      const rs = response("erro", 406, 'Codigo de segurança invalido. Coloque a sequencia correctamente');
      return rs
        
      
    }else{
      logger("SERVIDOR:redifinirSenha").info(`Codigo de segurança invalido. Por favor verifique`)
      const rs = response("erro", 406, 'Codigo de segurança invalido. Por favor verifique');
      return rs 
    }
       
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:redifinirSenha").error(`Erro ao redifinir a senha ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
     
}

module.exports.postClientes = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      const resultEnt  = await database('clientes').where({email: dados?.email})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Email usado por outra entidade`)
        const rs = response("erro", 409, "Email usado por outra entidade");
        return rs
      }
      
      logger("SERVIDOR:postClientes").error(`Verificar cliente pelo serviço Pagamento por referência`)
      const resultEmail  = await database('clientes')
      .where({contacto: dados?.contacto})
      
      if(resultEmail.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Número de telefone usado por outra entidade`)
        const rs = response("erro", 409, "Número de entidade usado por outra entidade");
        return rs
      }

      logger("SERVIDOR:postClientes").debug(`Verificar cliente pelo serviço GPO`)
      const resultComerciante  = await database('clientes')
      .where({nif: dados?.nif})
      
      if(resultComerciante.length > 0 ){
        logger("SERVIDOR:postClientes").info(`NIF usado por outra entidade, GPO`)
        const rs = response("erro", 409, "NIF usado por outra entidade, GPO");
        return rs
      }
      
      const validacao = dados.validacao
      delete dados?.validacao

      logger("SERVIDOR:Clientes").debug(`A cadastrar o cliente`) 
      if(dados?.nif) {
        await database('clientes').insert({...dados, nome_empresa: dados.nome_empresa.toUpperCase()})
      }
      else if(dados?.id_clientes){     
        await database('clientes').insert({...dados, nome_empresa: dados.nome_empresa.toUpperCase()})
      }

      const codigo_confirmacao = String(Math.random()).replaceAll(".","").substr(0,6);
      await database("configuracoes").where({email_cliente: dados.email}).update({codigo_confirmacao})
      
      const [info] = await database("configuracoes").where({email_cliente: dados.email})

      const notification = {
            mensagem: "yup.string().required()",
            para: validacao || "confirmacaoDeConta",
            efeito: { 
              empresa: dados.nome_empresa, 
              email: dados.email, 
              codigo_seguranca: validacao == "confirmacaoDeContaLink" ? info.link_confirmacao : codigo_confirmacao
            }, 
            informacao: {}, 
            canal: 'email',
            opcional: 'email'
        }

      delete dados.senha
      
      logger("SERVIDOR:Clientes").info(`Entidade criada com sucesso`)
      const rs = response("sucesso", 201, "Entidade criada com sucesso","json",{
        info: dados,
        notification
      });

      return rs
      
    } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao cadastrar o cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
    }
    
}

module.exports.loginClientes = async function({email, senha}, req) {

  
  try {
        logger("SERVIDOR:loginClientes").debug("Verificar se existencia do cliente")
        const result  = await database('clientes')
        .where({email})
        .andWhere({bloqueio: '0'});
      
      if(result.length == 0 ){
        logger("SERVIDOR:loginClientes").info("Dados não encontrados")
        const rs = response("erro", 401, "Dados não encontrados");
        return rs

      }else{   

          logger("SERVIDOR:loginClientes").debug("Buscar a configuração do cliente")
          const [verifivarPagamentoTempoReal] = await database('configuracoes').where({cliente: result[0].id_clientes})

          if(bcrypt.compareSync(senha, result[0].senha)){
                            
              
              if(verifivarPagamentoTempoReal?.tentativas_login > 0){

                  const login = new Date().toISOString().split('.')[0].replace('T',' ')
              
                  logger("SERVIDOR:loginClientes").debug("Actualizar o hash de login")
                  await database('clientes')
                  .where({email}).update({ultimo_login: login, hash_autenticador: uuidv4()})  
                  
                  logger("SERVIDOR:loginClientes").debug("Buscar dados do cliente")
                  const [resultNew]  = await database('clientes').select("hash_autenticador AS hash", "id_clientes AS entidade","ultimo_login AS login", "novo_usuario")
                  .join("configuracoes","configuracoes.cliente","=","clientes.id_clientes")
                  .where({email})

                  logger("SERVIDOR:loginClientes").debug("Repor os numeros de tentativas")
                  await database('configuracoes').where({cliente: resultNew.entidade}).update({tentativas_login: process.env.LIMITE_TENTATIVAS_LOGIN})

                  logger("SERVIDOR:loginClientes").info("Cliente logado com sucesso") 
                  const rs = response("sucesso", 202, {hash:resultNew.hash, ultimo_login: resultNew.login, novo_usuario: resultNew.novo_usuario, entidade: resultNew.entidade, master: true});
                  return rs

              }else{
                  logger("SERVIDOR:loginClientes").debug("Buscar dados do cliente")
                  const [resultNew]  = await database('clientes').select("email", "id_clientes AS entidade")
                  .where({email})
                  

                  logger("SERVIDOR:loginClientes").warn("Cliente bloqueiado")
                  const rs = response("erro", 403, "Seu perfil se encontra bloqueado. Por favor entre em contacto com administrador");
                  return rs

                }

          } else{
              logger("SERVIDOR:loginClientes").debug("Buscar a configuração de tentativas do cliente")
              const tentativas = await database('configuracoes').where({cliente: result[0].id_clientes})
              let count = tentativas[0]?.tentativas_login - 1
              
              if(tentativas[0]?.tentativas_login > 0){
                await database('configuracoes').where({cliente: result[0].id_clientes}).update({tentativas_login: count}) 
                logger("SERVIDOR:loginClientes").info("Autenticação incorrecta")
                const rs = response("erro", 401, "Autenticação incorrecta");
                return rs 
                
              }else{
                logger("SERVIDOR:loginClientes").warn("Cliente bloqueiado")
                const rs = response("erro", 403, "Seu perfil se encontra bloqueado. Por favor entre em contacto com administrador");
                return rs
                
              }
            
          }   
      }   
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:loginClientes").error(`Erro ao realizar o login ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
  
}

module.exports.logoutClientes = async function(entidade, req) {
  
  try {
        logger("SERVIDOR:logoutClientes").debug("Buscar a configuração do cliente")

        logger("SERVIDOR:logoutClientes").debug("Buscar dados do cliente")
        const result  = await database('clientes')
        .where({id_clientes: entidade})
        
        if(result.length > 0){

          const logout = new Date().toISOString().split('.')[0].replace('T',' ')
          logger("SERVIDOR:logoutClientes").debug("Actualizar o hash de login para zeros")
          await database('clientes').where({id_clientes: entidade}).update({hash_autenticador: "00000000000000000000", ultimo_logout: logout})

          logger("SERVIDOR:logoutClientes").info("Logout feito com sucesso")
          const rs = response("sucesso", 202, 'Logout feito com sucesso');
          return rs

        }else{
          logger("SERVIDOR:logoutClientes").info('Cliente desconhecido')
          const rs = response("erro", 406, 'Cliente desconhecido');
          return rs
          
        } 
        
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:logoutClientes").error(`Erro ao realizar o logout clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
  
}
 
module.exports.comunicarEmail = async function({email, assunto, html}, req) {
  
  try {

      const filtered = [];

      if(email.length){
        for( const i of email){
          logger("SERVIDOR:comunicarEmail").debug(`Verificar a existencia do email nos clientes`)
          const result  = await database('clientes')
          .where({email:i})

          if(result.length) filtered.push(i)
        }
        
      }

      if(!filtered.length){
        logger("SERVIDOR:comunicarEmail").info("Sem email para enviar")
        const rs = response("erro", 409, "Sem email para enviar");
        return rs    
      }

      logger("SERVIDOR:comunicarEmail").info(`Email enviados com sucesso`)
      const rs = response("sucesso", 201, "Email enviados com sucesso", "json", {
        notification: {efeito: {assunto, filtered, html}, para:"comunicarEmail", mensagem: 'null', canal:"email"},
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DEFAULT" , tabela: "CLIENTES", informacao: {email, assunto, html}, entidade: "01157"}
      });
      return rs
        
  } catch (erro) {
    console.log(erro.message)
    logger("SERVIDOR:comunicarEmail").error(`Erro ao realizar o email ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
  
}
 
module.exports.activarPorLInk = async function({link_confirmacao}, req) {
  
  try {

      const verificar = await database("configuracoes")
      .where({link_confirmacao})

      if(!verificar.length){
        logger("SERVIDOR:activarPorLInk").info("Link de verificação incorrecto")
        const rs = response("erro", 409, "Link de verificação incorrecto");
        return rs    
      }

      logger("SERVIDOR:activarPorLInk").info(`Link verificado com sucesso`)
      await database("clientes").where({email:verificar[0].email_cliente}).update({bloqueio:'0'})
      const rs = response("sucesso", 202, "Link verificado com sucesso",{
      info:{
        cliente: verificar[0].email_cliente,
        hash_activacao: link_confirmacao
      }});
      return rs
        
  } catch (erro) {
    console.log(erro.message)
    logger("SERVIDOR:activarPorLInk").error(`Erro ao realizar o email ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
  
}
 
module.exports.activarPorCodigo = async function({codigo_confirmacao}, req) {
  
  try {

      const verificar = await database("configuracoes")
      .where({codigo_confirmacao})

      if(!verificar.length){
        logger("SERVIDOR:activarPorLInk").info("Codigo verificado incorrecto")
        const rs = response("erro", 409, "Codigo verificado incorrecto");
        return rs    
      }

      logger("SERVIDOR:activarPorLInk").info(`Codigo verificado com sucesso`)
      await database("clientes").where({email:verificar[0].email_cliente}).update({bloqueio:'0'})
      const rs = response("sucesso", 202, "Codigo verificado com sucesso",{
      info:{
        cliente: verificar[0].email_cliente,
        pin_activacao: codigo_confirmacao
      }});
      return rs
        
  } catch (erro) {
    console.log(erro.message)
    logger("SERVIDOR:activarPorCodigo").error(`Erro ao realizar o email ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
  
  
}

module.exports.patchClientes = async function(id_clientes, dados, req) { 
  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const clienteVerify = await database('clientes').where({id_clientes})
    let entidade = ""

    if(!clienteVerify.length){
      logger("SERVIDOR:patchClientes").info("Cliente não foi encontrado")
      const rs = response("erro", 409, "Cliente não foi encontrado");
      return rs    
    }

    const cliente_update = new Date().toISOString().replace('T',' ').substr(0,19)
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('clientes').where({id_clientes}).update({...dados, cliente_update})
    

    logger("SERVIDOR:patchClientes").info(`Cliente actualizado com sucesso`)
    const rs = response("sucesso", 202, "Cliente actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.patchRedifinirIndustria = async function(id_clientes, dados, req) { 
  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const clienteVerify = await database('clientes').where({id_clientes})
    let entidade = ""

    if(!clienteVerify.length){
      logger("SERVIDOR:patchClientes").info("Cliente não foi encontrado")
      const rs = response("erro", 409, "Cliente não foi encontrado");
      return rs    
    }

    const cindustriaisVerify = await database('industrias_principais').where({id_industrias_principal: dados?.cliente_industria_id})

    if(!cindustriaisVerify.length){
      logger("SERVIDOR:patchClientes").info("Industria não foi encontrado")
      const rs = response("erro", 409, "Industria não foi encontrado");
      return rs    
    }

    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('clientes').where({id_clientes}).update({...dados})
    

    logger("SERVIDOR:patchClientes").info(`Industria actualizado com sucesso`)
    const rs = response("sucesso", 202, "Industria actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.patchRedifinirJurisdicao = async function(id_clientes, dados, req) { 
  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const clienteVerify = await database('clientes').where({id_clientes})
    let entidade = ""

    if(!clienteVerify.length){
      logger("SERVIDOR:patchClientes").info("Cliente não foi encontrado")
      const rs = response("erro", 409, "Cliente não foi encontrado");
      return rs    
    }

    const cJurisdicaoVerify = await database('jurisdicao_activa').where({jurisdicao_activa_id: dados?.cliente_jurisdicao_id})

    if(!cJurisdicaoVerify.length){
      logger("SERVIDOR:patchClientes").info("Jurisdicao não foi encontrado")
      const rs = response("erro", 409, "Jurisdicao não foi encontrado");
      return rs    
    }

    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('clientes').where({id_clientes}).update({...dados})
    

    logger("SERVIDOR:patchClientes").info(`Jurisdicao actualizado com sucesso`)
    const rs = response("sucesso", 202, "Jurisdicao actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.patchClientesRedifinirSenha = async function(id_clientes, dados, req) { 
  try {

      logger("SERVIDOR:patchClientesRedifinirSenha").debug(`Verificar se é um  cliente do serviço GPO`)
      const clienteVerify = await database('clientes').where({id_clientes})
      let entidade = ""

      if(!clienteVerify.length){
        logger("SERVIDOR:patchClientesRedifinirSenha").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      if(clienteVerify.length){
        id_clientes = clienteVerify[0].id_clientes
        entidade = clienteVerify[0].id_clientes
      }

      const cliente_update = new Date().toISOString().replace('T',' ').substr(0,19)
      
      logger("SERVIDOR:patchClientesRedifinirSenha").debug(`Actualizado o cliente`)
      await database('clientes').where({id_clientes}).update({...dados, novo_cliente: "0", cliente_update})

      logger("SERVIDOR:patchClientesRedifinirSenha").info(`Palavra-passe do cliente actualizada com sucesso`)
      const rs = response("sucesso", 202, "Palavra-passe do cliente actualizada com sucesso", "json", {
        logs: req && {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DEFAULT" , tabela: "CLIENTES", informacao: {...dados, id_clientes}, entidade: "01157"}
      });
      return rs
    
  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:patchClientesRedifinirSenha").error(`Erro ao actualizar da senha ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.patchClientesTrocarSenhaPadrao = async function(id_clientes, dados, req) { 
  try {

      logger("SERVIDOR:patchClientesTrocarSenhaPadrao").debug(`Verificar se é um  cliente do serviço GPO`)
      const clienteVerify = await database('clientes').where({id_clientes})
      let entidade = ""

      if(!clienteVerify.length){
        logger("SERVIDOR:patchClientesTrocarSenhaPadrao").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      if(clienteVerify.length){
        id_clientes = clienteVerify[0].id_clientes
        entidade = clienteVerify[0].id_clientes
      }


      const cliente_update = new Date().toISOString().replace('T',' ').substr(0,19)
      
      logger("SERVIDOR:patchClientesTrocarSenhaPadrao").debug(`Actualizado o cliente`)
      await database('clientes').where({id_clientes}).update({...dados, novo_cliente: "0", cliente_update})

      logger("SERVIDOR:patchClientesTrocarSenhaPadrao").info(`Palavra-passe padrão do cliente actualizada com sucesso`)
      const rs = response("sucesso", 202, "Palavra-passe padrão do cliente actualizada com sucesso", "json", {
        logs: req && {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DEFAULT" , tabela: "CLIENTES", informacao: {...dados, id_clientes}, entidade: "01157"}
      });
      return rs
    
  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:patchClientesTrocarSenhaPadrao").error(`Erro ao actualizar da senha padrão ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.patchClientesVerificarSenhaActual = async function(id_clientes, senha_actual, req) { 
  try {

      logger("SERVIDOR:patchClientesVerificarSenhaActual").debug(`Verificar se é um  cliente do serviço GPO`)
      const clienteVerify = await database('clientes').where({id_clientes})
      let entidade = ""

      if(!clienteVerify.length){
        logger("SERVIDOR:patchClientesVerificarSenhaActual").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      if(clienteVerify.length){
        id_clientes = clienteVerify[0].id_clientes
        entidade = clienteVerify[0].id_clientes
      }

      if(bcrypt.compareSync(senha_actual, clienteVerify[0].senha)){

        logger("SERVIDOR:patchClientesVerificarSenhaActual").info(`Palavra-passe actual do cliente verificada com sucesso`)
        const rs = response("sucesso", 202, "Palavra-passe actual do cliente verificada com sucesso");
        return rs

      }else {

        logger("SERVIDOR:patchClientesVerificarSenhaActual").info("Cliente não foi encontrado")
        const rs = response("erro", 401, "Palavra-passe incorrecta");
        return rs

      }
    
  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:patchClientesVerificarSenhaActual").error(`Erro ao actualizar da senha padrão ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.patchClientesAlterarSenha = async function(id_clientes, senha_actual, senha, req) { 
  try {

      logger("SERVIDOR:patchClientesAlterarSenha").debug(`Verificar se é um  cliente do serviço GPO`)
      const clienteVerify = await database('clientes').where({id_clientes})
      let entidade = ""

      if(!clienteVerify.length){
        logger("SERVIDOR:patchClientesAlterarSenha").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      if(clienteVerify.length){
        id_clientes = clienteVerify[0].id_clientes
        entidade = clienteVerify[0].id_clientes
      }

      if(bcrypt.compareSync(senha_actual, clienteVerify[0].senha)){

        const cliente_update = new Date().toISOString().replace('T',' ').substr(0,19)
      
        logger("SERVIDOR:patchClientesRedifinirSenha").debug(`Actualizado o cliente`)
        await database('clientes').where({id_clientes}).update({senha, cliente_update})

        logger("SERVIDOR:patchClientesAlterarSenha").info(`Palavra-passe actual do cliente verificada com sucesso`)
        const rs = response("sucesso", 202, "Palavra-passe actual do cliente verificada com sucesso");
        return rs

      }else {

        logger("SERVIDOR:patchClientesAlterarSenha").info("Cliente não foi encontrado")
        const rs = response("erro", 401, "Palavra-passe incorrecta");
        return rs

      }
    
  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:patchClientesAlterarSenha").error(`Erro ao actualizar da senha padrão ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.patchClientesFoto = async function(id_clientes, dados, req) {
  try {

      logger("SERVIDOR:mudarFotoClientes").error(`Erro ao mudar a foto do cliente`)
      const cliente_update = new Date().toISOString().replace('T',' ').substr(0,19)
      const cliente = await database('clientes').where({id_clientes})

      if(!cliente.length){
        logger("SERVIDOR:patchClientesBloquear").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:mudarFotoClientes").error(`Erro ao mudar a foto do cliente`)
      await database('clientes').where({id_clientes}).update({...dados, cliente_update})

      logger("SERVIDOR:mudarFotoClientes").error(`Erro ao mudar a foto do cliente`)
      const rs = response("sucesso", 202, "Logo da entidade actualizado com sucesso", "json", {
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "PATCH" , tabela: "CLIENTES", informacao: {...dados, id_clientes}, entidade: cliente[0].id_clientes}
      });
      return rs
    
  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:mudarFotoClientes").error(`Erro ao mudar a foto do cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.patchClientesArquivoContrato = async function(id_clientes, dados, req) {
  try {

      logger("SERVIDOR:patchClientesArquivoContrato").error(`Erro ao mudar a foto do cliente `)
      const cliente_update = new Date()
      .toISOString()
      .replace('T',' ')
      .substr(0,19)
      const cliente = await database('clientes').where({id_clientes})

      if(!cliente.length){
        logger("SERVIDOR:patchClientesArquivoContrato").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:patchClientesArquivoContrato").error(`Erro ao mudar a foto do cliente `)
      await database('clientes').where({id_clientes}).update({...dados, cliente_update})
      
      logger("SERVIDOR:patchClientesArquivoContrato").error(`Erro ao mudar a foto do cliente `)
      const rs = response("sucesso", 202, "Arquivo de contrato da entidade actualizado com sucesso", "json", {
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "PATCH" , tabela: "CLIENTES", informacao: {...dados, id_clientes}, entidade: cliente[0].id_clientes}
      });
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:patchClientesArquivoContrato").error(`Erro ao mudar o arquivo de contrato do cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.patchClientesBloquear = async function(id_clientes, req) {
  try {

      const cliente_update = new Date()
      .toISOString()
      .replace('T',' ')
      .substr(0,19)

      logger("SERVIDOR:patchClientesBloquear").info(`Verificar o cliente pelo Id ${id_clientes}`)
      const cliente = await database('clientes').where({id_clientes})

      if(!cliente.length){
        logger("SERVIDOR:patchClientesBloquear").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:patchClientesBloquear").info(`Actualizando para bloquear`)
      await database('clientes').where({id_clientes}).update({bloqueio:'0', cliente_update}) 

      logger("SERVIDOR:patchClientesBloquear").info(`Cliente bloqueado com sucesso`)
      const rs = response("sucesso", 202, "Cliente bloqueado com sucesso", "json", {
        notification: {efeito: {empresa: cliente[0].nome_empresa, email: cliente[0].email}, para:"bloququeioDeContaADM", mensagem: 'null', canal:"email"},
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DESATIVE" , tabela: "CLIENTES", informacao: {entidade: cliente[0].id_clientes, id_clientes}, entidade: cliente[0].id_clientes}
      });
      return rs
    
  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:patchClientesBloquear").error(`Erro ao bloquear o cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.patchClientesDesbloquear = async function(id_clientes, req) {
  try {

      const cliente_update = new Date()
      .toISOString()
      .replace('T',' ')
      .substr(0,19)

      logger("SERVIDOR:patchClientesDesbloquear").info(`Verificar o cliente pelo Id ${id_clientes}`)
      const cliente = await database('clientes').where({id_clientes})

      if(!cliente.length){
        logger("SERVIDOR:patchClientesDesbloquear").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:patchClientesDesbloquear").info(`Actualizando para desbloquear`)
      await database('clientes').where({id_clientes}).update({bloqueio:'1', cliente_update})
      
      logger("SERVIDOR:patchClientesDesbloquear").info(`Cliente desbloqueado com sucesso`)
      const rs = response("sucesso", 202, "Cliente desbloqueado com sucesso", "json", {
        notification: {efeito: {empresa: cliente[0].nome_empresa, email: cliente[0].email}, para:"desbloququeioDeContaADM", mensagem: 'null', canal:"email"},
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "ACTIVE" , tabela: "CLIENTES", informacao: {entidade: cliente[0].id_clientes, id_clientes}, entidade: cliente[0].id_clientes}
      });
      return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientesDesbloquear").error(`Erro ao desbloquear o cliente ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.configurarReporClientes = async function(id_clientes,  tentativas_login , req) {
  try {

      logger("SERVIDOR:configurarReporClientes").debug(`Verificar a existencia do cliente`)
      const cliente = await database('clientes').where({id_clientes})

      if(!cliente.length){
        logger("SERVIDOR:configurarReporClientes").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:configurarReporClientes").debug(`Actualizar os numeros de tentativas de login no padrão`)
      await database('configuracoes').where({cliente: cliente[0].id_clientes}).update({tentativas_login: process.env.LIMITE_TENTATIVAS_LOGIN})

      logger("SERVIDOR:configurarReporClientes").debug(`Actualizar o cliente para o estado de novo cliente`)
      await database('clientes').where({id_clientes}).update({novo_cliente:"1"})

      logger("SERVIDOR:configurarReporClientes").info(`A conta da entidade foi reposta com sucesso`)
      const rs = response("sucesso", 202, "A conta da entidade foi reposta com sucesso", "json", {
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "PATH", tabela: "CONFIGURACOES", informacao: {tentativas_login, entidade: cliente[0].id_clientes, id_clientes}, entidade: cliente[0].id_clientes}
      });
      return rs
    
  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:configurarReporClientes").error(`Erro ao repor o cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.deleteClientes = async function(id_clientes, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const clienteVerify = await database('clientes').where({id_clientes}).orWhere({gpo_numero_comerciante:id_clientes})
      let entidade = ""

      if(!clienteVerify.length){
        logger("SERVIDOR:deleteClientes").info("Cliente não foi encontrado")
        const rs = response("erro", 409, "Cliente não foi encontrado");
        return rs    
      }

      if(clienteVerify.length){
        id_clientes = clienteVerify[0].id_clientes
        entidade = clienteVerify[0].id_clientes
      }   

      logger("SERVIDOR:deleteClientes").debug(`Verificar a existência do cliente`)
      const cliente = await database('clientes').where({id_clientes})
      
      logger("SERVIDOR:deleteClientes").debug(`Verificar se o cliente tem referências geradas e usadas`)
      const clientesReferences = await database('referencias').where({entidade_cliente: cliente[0].id_clientes});
      
      if(clientesReferences.length){
        logger("SERVIDOR:deleteClientes").info(`Cliente não exluido. Tem referencias geradas`)
        const rs = response("erro", 409, "Cliente não exluido. Tem referencias geradas");
        return rs
      }

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o cliente tem historico de pagamentos`)
      const clientesPagamentos = await database('pagamentos').where({id_clientes: cliente[0].id_clientes});

      if(clientesPagamentos.length){
        logger("SERVIDOR:deleteClientes").info(`Cliente não exluido. Tem pagamentos feitos`)
        const rs = response("erro", 409, "Cliente não exluido. Tem pagamentos feitos");
        return rs
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('clientes').where({id_clientes}).del() 

      logger("SERVIDOR:deleteClientes").info("Cliente exluido com sucesso")
      const rs = response("sucesso", 202, "Cliente exluido com sucesso", "json", {
        gpo_comerciante_hash: cliente[0].gpo_comerciante_hash,      
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DELETE" , tabela: "CLIENTES", informacao: {entidade: cliente[0].id_clientes, id_clientes}, entidade: cliente[0].id_clientes}
      });
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}