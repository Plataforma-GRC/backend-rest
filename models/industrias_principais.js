const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getIndustriasPrincipais = async function(pagina, limite, industrias_principal_descricao) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const Industrias = await database('industrias_principais')
      .whereLike("industrias_principal_descricao",`%${industrias_principal_descricao}%`)
      .orderBy('id_industrias_principal','DESC')

      const {registros} = paginationRecords(Industrias, pagina, limite)

      logger("Clientes").debug(`Buscar todos Industrias no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('industrias_principais')
      .whereLike("industrias_principal_descricao",`%${industrias_principal_descricao}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_industrias_principal','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.industrias_principal_descricao = industrias_principal_descricao

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

module.exports.getIndustriasPrincipaisComFrameworks = async function(pagina, limite, industrias_principal_descricao) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const Industrias = await database('industrias_principais')
      .whereLike("industrias_principal_descricao",`%${industrias_principal_descricao}%`)
      .orderBy('id_industrias_principal','DESC')

      const {registros} = paginationRecords(Industrias, pagina, limite)

      logger("Clientes").debug(`Buscar todos Industrias no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('industrias_principais')
      .whereLike("industrias_principal_descricao",`%${industrias_principal_descricao}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_industrias_principal','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.industrias_principal_descricao = industrias_principal_descricao

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

module.exports.getIndustriasPrincipaisId = async function(id_industrias_principal) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [industrias_principais] = await database('industrias_principais')
      .where({id_industrias_principal})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, industrias_principais || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar Industrias por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postIndustriasPrincipais = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultEnt  = await database('industrias_principais')
      .where({industrias_principal_descricao: dados?.industrias_principal_descricao})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('industrias_principais').insert(dados)
      
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


module.exports.patchIndustriasPrincipais = async function(id_industrias_principal, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('industrias_principais').where({id_industrias_principal})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("industrias_principal_descricao da lista configurado não foi encontrado")
      const rs = response("erro", 409, "industrias_principal_descricao da lista configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('industrias_principais').where({id_industrias_principal}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`industrias_principal_descricao da lista actualizado com sucesso`)
    const rs = response("sucesso", 202, "industrias_principal_descricao da lista actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar Industrias ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteIndustriasPrincipais = async function(id_industrias_principal, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o Industrias é do serviço GPO`)
      const catergoriaVerify = await database('industrias_principais').where({id_industrias_principal})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("industria configurado não foi encontrado")
        const rs = response("erro", 409, "industria configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('industrias_principais').where({id_industrias_principal}).del() 

      logger("SERVIDOR:deleteClientes").info("Categoria ao risco exluido com sucesso")
      const rs = response("sucesso", 202, "Categoria ao risco exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
