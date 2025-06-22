const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getListaDeCategorias = async function(pagina, limite, categoria) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('lista_de_categoria_de_risco')
      .whereLike("categoria",`%${categoria}%`)
      .orderBy('id_lista_de_categoria_de_risco','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('lista_de_categoria_de_risco')
      .whereLike("categoria",`%${categoria}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_lista_de_categoria_de_risco','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.categoria = categoria

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

module.exports.getListaDeCategoriasId = async function(id_lista_de_categoria_de_risco) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [lista_de_categoria_de_risco] = await database('lista_de_categoria_de_risco')
      .where({id_lista_de_categoria_de_risco})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, lista_de_categoria_de_risco || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postListaDeCategorias = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultEnt  = await database('lista_de_categoria_de_risco')
      .where({categoria: dados?.categoria})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('lista_de_categoria_de_risco').insert(dados)
      
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


module.exports.patchListaDeCategorias = async function(id_lista_de_categoria_de_risco, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('lista_de_categoria_de_risco').where({id_lista_de_categoria_de_risco})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("categoria da lista configurado não foi encontrado")
      const rs = response("erro", 409, "categoria da lista configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('lista_de_categoria_de_risco').where({id_lista_de_categoria_de_risco}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`categoria da lista actualizado com sucesso`)
    const rs = response("sucesso", 202, "categoria da lista actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteListaDeCategorias = async function(id_lista_de_categoria_de_risco, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('lista_de_categoria_de_risco').where({id_lista_de_categoria_de_risco})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("catergoria ao risco configurado não foi encontrado")
        const rs = response("erro", 409, "catergoria ao risco configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('lista_de_categoria_de_risco').where({id_lista_de_categoria_de_risco}).del() 

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
