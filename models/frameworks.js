const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getFrameworks = async function(pagina, limite, framework_nome, framework_sigla, framework_descricao, framework_ano, framework_status) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('framework')
      .whereLike("framework_nome",`%${framework_nome}%`)
      .whereLike("framework_sigla",`%${framework_sigla}%`)
      .whereLike("framework_descricao",`%${framework_descricao}%`)
      .whereLike("framework_ano",`%${framework_ano}%`)
      .whereLike("framework_status",`%${framework_status}%`)
      .orderBy('framework_id','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('framework')
      .whereLike("framework_nome",`%${framework_nome}%`)
      .whereLike("framework_sigla",`%${framework_sigla}%`)
      .whereLike("framework_descricao",`%${framework_descricao}%`)
      .whereLike("framework_ano",`%${framework_ano}%`)
      .whereLike("framework_status",`%${framework_status}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('framework_id','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.framework_nome = framework_nome
      registros.framework_sigla = framework_sigla
      registros.framework_descricao = framework_descricao
      registros.framework_ano = framework_ano
      registros.framework_status = framework_status

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


module.exports.getFrameworksTipo = async function(framework_tipo_id, framework_nome, framework_sigla, framework_descricao, framework_ano, framework_status) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const framework = await database('framework')
      .join("framework_tipo","framework_tipo.framework_tipo_id","=","framework.framework_tipo_id_fk")
      .whereLike("framework_nome",`%${framework_nome}%`)
      .whereLike("framework_sigla",`%${framework_sigla}%`)
      .whereLike("framework_descricao",`%${framework_descricao}%`)
      .whereLike("framework_ano",`%${framework_ano}%`)
      .whereLike("framework_status",`%${framework_status}%`)
      .where({framework_tipo_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, framework);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}


module.exports.getFrameworksOrgao = async function(framework_orgao_id, framework_nome, framework_sigla, framework_descricao, framework_ano, framework_status) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const framework = await database('framework')
      .join("framework_orgao","framework_orgao.framework_orgao_id","=","framework.framework_orgao_id_fk")
      .whereLike("framework_nome",`%${framework_nome}%`)
      .whereLike("framework_sigla",`%${framework_sigla}%`)
      .whereLike("framework_descricao",`%${framework_descricao}%`)
      .whereLike("framework_ano",`%${framework_ano}%`)
      .whereLike("framework_status",`%${framework_status}%`)
      .where({framework_orgao_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, framework);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getFrameworksCliente = async function(clientes_id_fk, framework_nome, framework_sigla, framework_descricao, framework_ano, framework_status) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const framework = await database('framework')
      .join("clientes_frameworks","clientes_frameworks.frameworks_id_fk","=","framework.framework_id")
      .whereLike("framework_nome",`%${framework_nome}%`)
      .whereLike("framework_sigla",`%${framework_sigla}%`)
      .whereLike("framework_descricao",`%${framework_descricao}%`)
      .whereLike("framework_ano",`%${framework_ano}%`)
      .whereLike("framework_status",`%${framework_status}%`)
      .where({clientes_id_fk})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, framework);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getFrameworksId = async function(framework_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [framework] = await database('framework')
      .where({framework_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, framework || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postFrameworks = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultEnt  = await database('framework')
      .where({framework_nome: dados?.framework_nome})
      .andWhere({framework_sigla: dados?.framework_sigla})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Nome de framework já usado`)
        const rs = response("erro", 409, "Nome de framework já usado");
        return rs
      }      
      
      await database('framework').insert(dados)
      
      logger("SERVIDOR:Clientes").info(`Parametização criada com sucesso`)
      const rs = response("sucesso", 201, "Parametização criada com sucesso","json",{
        info: dados
      });

      return rs
      
    } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao cadastrar o cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
    }
    
}

module.exports.postFrameworksEscolher = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultEnt  = await database('clientes_frameworks')
      .where({frameworks_id_fk: dados?.frameworks_id_fk})
      .andWhere({clientes_id_fk: dados?.clientes_id_fk})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Framework já escolhido`)
        const rs = response("erro", 409, "Framework já escolhido");
        return rs
      }      
      
      await database('clientes_frameworks').insert(dados)
      
      logger("SERVIDOR:Clientes").info(`Parametização criada com sucesso`)
      const rs = response("sucesso", 201, "Parametização criada com sucesso","json",{
        info: dados
      });

      return rs
      
    } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao cadastrar o cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
    }
    
}


module.exports.patchFrameworks = async function(framework_id, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('framework').where({framework_id})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("framework configurado não foi encontrado")
      const rs = response("erro", 409, "framework configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('framework').where({framework_id}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`framework actualizado com sucesso`)
    const rs = response("sucesso", 202, "framework actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteFrameworks = async function(framework_id, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('framework').where({framework_id})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("framework configurado não foi encontrado")
        const rs = response("erro", 409, "framework configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('framework').where({framework_id}).del() 

      logger("SERVIDOR:deleteClientes").info("Framework exluido com sucesso")
      const rs = response("sucesso", 202, "Framework exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.deleteFrameworksEscolhido = async function(clientes_frameworks, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('clientes_frameworks').where({clientes_frameworks})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("framework configurado não foi encontrado")
        const rs = response("erro", 409, "framework configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('clientes_frameworks').where({clientes_frameworks}).del() 

      logger("SERVIDOR:deleteClientes").info("Framework escolhido exluido com sucesso")
      const rs = response("sucesso", 202, "Framework escolhido exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
