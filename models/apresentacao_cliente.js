const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getApresentacaoCliente = async function(pagina, limite, missao, visao, valores, cliente_apresentado) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('apresentacao_cliente')
      .whereLike("missao",`%${missao}%`)
      .whereLike("visao",`%${visao}%`)
      .whereLike("valores",`%${valores}%`)
      .whereLike("cliente_apresentado",`%${cliente_apresentado}%`)
      .orderBy('id_apresenta','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('apresentacao_cliente')
      .whereLike("missao",`%${missao}%`)
      .whereLike("visao",`%${visao}%`)
      .whereLike("valores",`%${valores}%`)
      .whereLike("cliente_apresentado",`%${cliente_apresentado}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_apresenta','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.missao = missao
      registros.visao = visao
      registros.valores = valores
      registros.cliente_apresentado = cliente_apresentado

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

module.exports.getApresentacaoClienteId = async function(id_apresenta) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [apresentacao_cliente] = await database('apresentacao_cliente')
      .where({id_apresenta})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, apresentacao_cliente || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesApresentacaoCliente = async function(cliente_apresentado) {
  try {

      logger("SERVIDOR:getClientesEntidade").debug("Á buscar os dados")
      const apresentacao_cliente = await database('apresentacao_cliente')
      .where({cliente_apresentado})
      .orderBy('id_apresenta','DESC')  
    
      logger("SERVIDOR:getClientesEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, apresentacao_cliente, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getClientesEntidade").error(`Erro ao buscar clientes por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postApresentacaoCliente = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultCliente  = await database('clientes')
      .where({id_clientes: dados?.cliente_apresentado})
      
      if(!resultCliente.length){
        logger("SERVIDOR:postClientes").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Cliente inexistente");
        return rs
      }
      
      const resultEnt  = await database('apresentacao_cliente')
      .where({cliente_apresentado: dados?.cliente_apresentado})
      .andWhere({missao: dados?.missao})
      .andWhere({visao: dados?.visao})
      .andWhere({valores: dados?.valores})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('apresentacao_cliente').insert(dados)
      
      logger("SERVIDOR:Clientes").info(`Parametrização criada com sucesso`)
      const rs = response("sucesso", 201, "Parametrização criada com sucesso","json",{
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


module.exports.patchApresentacaoCliente = async function(id_apresenta, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('apresentacao_cliente').where({id_apresenta})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("Parametrização  configurado não foi encontrado")
      const rs = response("erro", 409, "Parametrização  configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('apresentacao_cliente').where({id_apresenta}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`Parametrização  actualizada com sucesso`)
    const rs = response("sucesso", 202, "Parametrização  actualizada com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteApresentacaoCliente = async function(id_apresenta, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('apresentacao_cliente').where({id_apresenta})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("Parametrização  configurada não foi encontrado")
        const rs = response("erro", 409, "Parametrização  configurada não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('apresentacao_cliente').where({id_apresenta}).del() 

      logger("SERVIDOR:deleteClientes").info("Parametrização  exluido com sucesso")
      const rs = response("sucesso", 202, "Parametrização  exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
