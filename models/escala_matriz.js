const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres, escalasMatrizFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getEscalaMatriz = async function(pagina, limite) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const Industrias = await database('riscos_matriz')
      .orderBy('risco_matriz_id','DESC')

      const {registros} = paginationRecords(Industrias, pagina, limite)

      logger("Clientes").debug(`Buscar todos Industrias no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('riscos_matriz')
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('risco_matriz_id','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length

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

module.exports.getEscalaMatrizPorEscala = async function(risco_escala_matrix_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const riscos_matriz = await database('riscos_matriz')
      .where({risco_escala_matrix_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, riscos_matriz);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar Industrias por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getEscalaMatrizPorEmpresa = async function(riscos_matriz_empresa_fk) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const riscos_matriz = await database('riscos_matriz')
      .where({riscos_matriz_empresa_fk})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, riscos_matriz);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar Industrias por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getEscalaMatrizId = async function(risco_matriz_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [riscos_matriz] = await database('riscos_matriz')
      .where({risco_matriz_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, riscos_matriz || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar Industrias por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getEscalaMatrizEscalas = async function() {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const riscos_matriz_escalas = await database('riscos_matriz_escala')
      const riscos_matriz_classificacao = await database('riscos_classificacao')

      const filtered = escalasMatrizFilteres(riscos_matriz_escalas, riscos_matriz_classificacao)
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, filtered);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar Industrias por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postEscalaMatriz = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultEnt  = await database('riscos_matriz')
      .where({industrias_principal_descricao: dados?.industrias_principal_descricao})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('riscos_matriz').insert(dados)
      
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

module.exports.patchEscalaMatriz = async function(risco_matriz_id, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('riscos_matriz').where({risco_matriz_id})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("industrias_principal_descricao da lista configurado não foi encontrado")
      const rs = response("erro", 409, "industrias_principal_descricao da lista configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('riscos_matriz').where({risco_matriz_id}).update({...dados})

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

module.exports.deleteEscalaMatriz = async function(risco_matriz_id, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o Industrias é do serviço GPO`)
      const catergoriaVerify = await database('riscos_matriz').where({risco_matriz_id})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("industria configurado não foi encontrado")
        const rs = response("erro", 409, "industria configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('riscos_matriz').where({risco_matriz_id}).del() 

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
