const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getCategoriaAoRisco = async function(pagina, limite, categoria_risco, materialidade, cliente_categorizado) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('categoria_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","categoria_de_risco.categoria_risco")
      .whereLike("categoria_risco",`%${categoria_risco}%`)
      .whereLike("materialidade",`%${materialidade}%`)
      .whereLike("cliente_categorizado",`%${cliente_categorizado}%`)
      .orderBy('id_categoria_de_risco','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('categoria_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","categoria_de_risco.categoria_risco")
      .whereLike("categoria_risco",`%${categoria_risco}%`)
      .whereLike("materialidade",`%${materialidade}%`)
      .whereLike("cliente_categorizado",`%${cliente_categorizado}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_categoria_de_risco','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.categoria_risco = categoria_risco
      registros.materialidade = materialidade
      registros.cliente_categorizado = cliente_categorizado

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

module.exports.getCategoriaAoRiscoId = async function(id_categoria_de_risco) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [categoria_de_risco] = await database('categoria_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","categoria_de_risco.categoria_risco")
      .where({id_categoria_de_risco})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, categoria_de_risco || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesCategoriaAoRisco = async function(cliente_categorizado) {
  try {

      logger("SERVIDOR:getClientesEntidade").debug("Á buscar os dados")
      const categoria_de_risco = await database('categoria_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","categoria_de_risco.categoria_risco")
      .where({cliente_categorizado})
      .orderBy('id_categoria_de_risco','DESC')  
    
      logger("SERVIDOR:getClientesEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, categoria_de_risco, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getClientesEntidade").error(`Erro ao buscar clientes por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postCategoriaAoRisco = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultCliente  = await database('clientes')
      .where({id_clientes: dados?.cliente_categorizado})
      
      if(!resultCliente.length){
        logger("SERVIDOR:postClientes").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Cliente inexistente");
        return rs
      }
      
      const resultEnt  = await database('categoria_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","categoria_de_risco.categoria_risco")
      .whereIn('categoria_risco', dados?.categoria_risco)
      .andWhere({cliente_categorizado: dados?.cliente_categorizado})      

      if(resultEnt.length > 0 ){
        const find = resultEnt.map(vl => vl.categoria)
        logger("SERVIDOR:postClientes").info(`Configuração já usada ${find}`)
        const rs = response("erro", 409, `Configuração já usada ${find}`);
        return rs
      } 
      
      
      for (const fr of dados?.frameworks_id_fk)
        await database('clientes_frameworks').insert({cliente_categorizado: dados?.cliente_categorizado, categoria_risco: fr})
      
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


module.exports.patchCategoriaAoRisco = async function(id_categoria_de_risco, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('categoria_de_risco').where({id_categoria_de_risco})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("categoria ao risco configurado não foi encontrado")
      const rs = response("erro", 409, "categoria ao risco configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('categoria_de_risco').where({id_categoria_de_risco}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`categoria ao risco actualizado com sucesso`)
    const rs = response("sucesso", 202, "categoria ao risco actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteCategoriaAoRisco = async function(id_categoria_de_risco, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('categoria_de_risco').where({id_categoria_de_risco})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("catergoria ao risco configurado não foi encontrado")
        const rs = response("erro", 409, "catergoria ao risco configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('categoria_de_risco').where({id_categoria_de_risco}).del() 

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
