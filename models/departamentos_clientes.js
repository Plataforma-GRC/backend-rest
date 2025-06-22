const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getDepartamentosClientes = async function(pagina, limite, empresa_dona, departamento) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('departamento_clientes')
      .whereLike("departamento",`%${departamento}%`)
      .whereLike("empresa_dona",`%${empresa_dona}%`)
      .orderBy('id_departamento','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('departamento_clientes')
      .whereLike("departamento",`%${departamento}%`)
      .whereLike("empresa_dona",`%${empresa_dona}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_departamento','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.departamento = departamento
      registros.empresa_dona = empresa_dona

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

module.exports.getDepartamentosClientesId = async function(id_departamento) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [departamento_clientes] = await database('departamento_clientes')
      .where({id_departamento})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, departamento_clientes || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getDepartamentosClientesPorEmpresa = async function(empresa_dona) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const departamento_clientes = await database('departamento_clientes')
      .where({empresa_dona})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, departamento_clientes);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postDepartamentosClientes = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const clientes = await database('clientes')
      .where({id_clientes: dados?.empresa_dona})
      
      if(!clientes.length){
        logger("SERVIDOR:postClientes").info(`Registro de empresa ou clienete não foram encontrados`)
        const rs = response("erro", 409, "Registro de empresa ou clienete não foram encontrados");
        return rs
      }
      
      const resultEnt  = await database('departamento_clientes')
      .where({departamento: dados?.departamento})
      .andWhere({empresa_dona: dados?.empresa_dona})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`departamento já configurada para a cliente`)
        const rs = response("erro", 409, "departamento já configurada para a cliente");
        return rs
      }
      
      
      await database('departamento_clientes').insert(dados)
      
      logger("SERVIDOR:Clientes").info(`Entidade criada com sucesso`)
      const rs = response("sucesso", 201, "Entidade criada com sucesso","json",{
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


module.exports.patchDepartamentosClientes = async function(id_departamento, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('departamento_clientes').where({id_departamento})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("departamento configurado não foi encontrado")
      const rs = response("erro", 409, "departamento configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('departamento_clientes').where({id_departamento}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`departamento actualizado com sucesso`)
    const rs = response("sucesso", 202, "departamento actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteDepartamentosClientes = async function(id_departamento, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('departamento_clientes').where({id_departamento})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("departamento da categoria configurado não foi encontrado")
        const rs = response("erro", 409, "departamento da categoria configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('departamento_clientes').where({id_departamento}).del() 

      logger("SERVIDOR:deleteClientes").info("departamento exluida com sucesso")
      const rs = response("sucesso", 202, "departamento exluida com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
