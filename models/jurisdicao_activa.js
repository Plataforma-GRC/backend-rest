const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getJurisdicaoActiva = async function(pagina, limite, jurisdicao_activa_descricao) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const Industrias = await database('jurisdicao_activa')
      .whereLike("jurisdicao_activa_descricao",`%${jurisdicao_activa_descricao}%`)
      .orderBy('jurisdicao_activa_id','DESC')

      const {registros} = paginationRecords(Industrias, pagina, limite)

      logger("Clientes").debug(`Buscar todos Industrias no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('jurisdicao_activa')
      .whereLike("jurisdicao_activa_descricao",`%${jurisdicao_activa_descricao}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('jurisdicao_activa_id','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.jurisdicao_activa_descricao = jurisdicao_activa_descricao

      logger("SERVIDOR:Clientes").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, filtered, "json", { registros });
      return rs


  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar Industrias ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getJurisdicaoActivaId = async function(jurisdicao_activa_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [jurisdicao_activa] = await database('jurisdicao_activa')
      .where({jurisdicao_activa_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, jurisdicao_activa || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar Industrias por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postJurisdicaoActiva = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultEnt  = await database('jurisdicao_activa')
      .where({jurisdicao_activa_descricao: dados?.jurisdicao_activa_descricao})
      .andWhere({jurisdicao_activa_pais: dados?.jurisdicao_activa_pais})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('jurisdicao_activa').insert(dados)
      
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


module.exports.patchJurisdicaoActiva = async function(jurisdicao_activa_id, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('jurisdicao_activa').where({jurisdicao_activa_id})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("jurisdicao da lista configurado não foi encontrado")
      const rs = response("erro", 409, "jurisdicao  da lista configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('jurisdicao_activa').where({jurisdicao_activa_id}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`jurisdicao da lista actualizado com sucesso`)
    const rs = response("sucesso", 202, "jurisdicao  da lista actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar Industrias ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteJurisdicaoActiva = async function(jurisdicao_activa_id, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o Industrias é do serviço GPO`)
      const catergoriaVerify = await database('jurisdicao_activa').where({jurisdicao_activa_id})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("industria configurado não foi encontrado")
        const rs = response("erro", 409, "industria configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('jurisdicao_activa').where({jurisdicao_activa_id}).del() 

      logger("SERVIDOR:deleteClientes").info("Industria exluido com sucesso")
      const rs = response("sucesso", 202, "Industria exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
