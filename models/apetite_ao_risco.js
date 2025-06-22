const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getApetites = async function(pagina, limite, pontuacao_minima, pontuacao_maxima, apetite, descricao, cliente_apetite) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('apetite_ao_risco')
      .whereLike("pontuacao_minima",`%${pontuacao_minima}%`)
      .whereLike("pontuacao_maxima",`%${pontuacao_maxima}%`)
      .whereLike("apetite",`%${apetite}%`)
      .whereLike("descricao",`%${descricao}%`)
      .whereLike("cliente_apetite",`%${cliente_apetite}%`)
      .orderBy('id_apetite','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('apetite_ao_risco')
      .whereLike("pontuacao_minima",`%${pontuacao_minima}%`)
      .whereLike("pontuacao_maxima",`%${pontuacao_maxima}%`)
      .whereLike("apetite",`%${apetite}%`)
      .whereLike("descricao",`%${descricao}%`)
      .whereLike("cliente_apetite",`%${cliente_apetite}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_apetite','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.pontuacao_minima = pontuacao_minima
      registros.pontuacao_maxima = pontuacao_maxima
      registros.apetite = apetite
      registros.descricao = descricao
      registros.cliente_apetite = cliente_apetite

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

module.exports.getApetiteId = async function(id_apetite) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [apetite] = await database('apetite_ao_risco')
      .where({id_apetite})
      .orderBy('id_apetite','DESC')
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, apetite || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesApetite = async function(cliente_apetite) {
  try {

      logger("SERVIDOR:getClientesEntidade").debug("Á buscar os dados")
      const apetite = await database('apetite_ao_risco')
      .where({cliente_apetite})
      .orderBy('id_apetite','DESC')  
    
      logger("SERVIDOR:getClientesEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, apetite, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getClientesEntidade").error(`Erro ao buscar clientes por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postApetite = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultCliente  = await database('clientes')
      .where({id_clientes: dados?.cliente_apetite})
      
      if(!resultCliente.length){
        logger("SERVIDOR:postClientes").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Cliente inexistente");
        return rs
      }
      
      const resultEnt  = await database('apetite_ao_risco')
      .where({cliente_apetite: dados?.cliente_apetite})
      .andWhere({apetite: dados?.apetite})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('apetite_ao_risco').insert(dados)
      
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


module.exports.patchApetite = async function(id_apetite, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const apetiteVerify = await database('apetite_ao_risco').where({id_apetite})

    if(!apetiteVerify.length){
      logger("SERVIDOR:patchClientes").info("Apetite configurado não foi encontrado")
      const rs = response("erro", 409, "Apetite configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('apetite_ao_risco').where({id_apetite}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`Apetite actualizado com sucesso`)
    const rs = response("sucesso", 202, "Apetite actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}
