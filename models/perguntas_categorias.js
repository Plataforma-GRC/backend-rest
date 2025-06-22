const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getPerguntasCategorias = async function(pagina, limite, categoria_id, pergunta) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('perguntas_categorias')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","perguntas_categorias.categoria_id")
      .whereLike("pergunta",`%${pergunta}%`)
      .whereLike("categoria_id",`%${categoria_id}%`)
      .orderBy('id_pergunta','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('perguntas_categorias')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","perguntas_categorias.categoria_id")
      .whereLike("pergunta",`%${pergunta}%`)
      .whereLike("categoria_id",`%${categoria_id}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_pergunta','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.pergunta = pergunta
      registros.categoria_id = categoria_id

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

module.exports.getPerguntasCategoriasId = async function(id_pergunta) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [perguntas_categorias] = await database('perguntas_categorias')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","perguntas_categorias.categoria_id")
      .where({id_pergunta})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, perguntas_categorias || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getPerguntasCategoriasPorCategoria = async function(categoria_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const perguntas_categorias = await database('perguntas_categorias')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","perguntas_categorias.categoria_id")
      .where({categoria_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, perguntas_categorias);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postPerguntasCategorias = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const lista_de_categoria_de_risco = await database('lista_de_categoria_de_risco')
      .where({id_lista_de_categoria_de_risco: dados?.categoria_id})
      
      if(!lista_de_categoria_de_risco.length){
        logger("SERVIDOR:postClientes").info(`Categoria não encontrada`)
        const rs = response("erro", 409, "Categoria não encontrada");
        return rs
      }
      
      const resultEnt  = await database('perguntas_categorias')
      .where({pergunta: dados?.pergunta})
      .andWhere({categoria_id: dados?.categoria_id})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Pergunta já configurada para a categoria`)
        const rs = response("erro", 409, "Pergunta já configurada para a categoria");
        return rs
      }
      
      
      await database('perguntas_categorias').insert(dados)
      
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


module.exports.patchPerguntasCategorias = async function(id_pergunta, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('perguntas_categorias').where({id_pergunta})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("pergunta configurado não foi encontrado")
      const rs = response("erro", 409, "pergunta configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('perguntas_categorias').where({id_pergunta}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`pergunta actualizado com sucesso`)
    const rs = response("sucesso", 202, "pergunta actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deletePerguntasCategorias = async function(id_pergunta, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('perguntas_categorias').where({id_pergunta})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("pergunta da categoria configurado não foi encontrado")
        const rs = response("erro", 409, "pergunta da categoria configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('perguntas_categorias').where({id_pergunta}).del() 

      logger("SERVIDOR:deleteClientes").info("Pergunta exluida com sucesso")
      const rs = response("sucesso", 202, "Pergunta exluida com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
