const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getRespostasCategoriazadas = async function(pagina, limite, resposta, pergunta_id) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('reposta_pergunta_categoria')
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","reposta_pergunta_categoria.pergunta_id")
      .whereLike("resposta",`%${resposta}%`)
      .whereLike("pergunta_id",`%${pergunta_id}%`)
      .orderBy('id_resposta','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('reposta_pergunta_categoria')
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","reposta_pergunta_categoria.pergunta_id")
      .whereLike("resposta",`%${resposta}%`)
      .whereLike("pergunta_id",`%${pergunta_id}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_resposta','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.resposta = resposta
      registros.pergunta_id = pergunta_id

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


module.exports.getRespostasCategoriazadasPoResposta = async function(id_resposta) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [reposta_pergunta_categoria] = await database('reposta_pergunta_categoria')
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","reposta_pergunta_categoria.pergunta_id")
      .where({id_resposta})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, reposta_pergunta_categoria || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getRespostasCategoriazadasPoPergunta = async function(pergunta_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const reposta_pergunta_categoria = await database('reposta_pergunta_categoria')
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","reposta_pergunta_categoria.pergunta_id")
      .where({pergunta_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, reposta_pergunta_categoria);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getRespostasCategoriazadasPoPerguntaECategoria = async function(pergunta_id, categoria_da_pergunta) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const reposta_pergunta_categoria = await database('reposta_pergunta_categoria')
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","reposta_pergunta_categoria.pergunta_id")
      .where({pergunta_id})
      .andWhere({categoria_da_pergunta})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, reposta_pergunta_categoria);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postRespostasCategoriazadas = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const perguntas_categorias = await database('perguntas_categorias')
      .where({id_pergunta: dados?.pergunta_id})
      
      if(!perguntas_categorias.length){
        logger("SERVIDOR:postClientes").info(`Pergunta não encontrada`)
        const rs = response("erro", 409, "Pergunta não encontrada");
        return rs
      }
      
      const resultEnt  = await database('reposta_pergunta_categoria')
      .where({resposta: dados?.resposta})
      .andWhere({pergunta_id: dados?.pergunta_id})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`resposta já configurada para a pergunta`)
        const rs = response("erro", 409, "resposta já configurada para a pergunta");
        return rs
      }
      
      const resultPergunta  = await database('reposta_pergunta_categoria')
      .where({resposta: dados?.resposta})
      .andWhere({nivel_de_aceitacao: dados?.nivel_de_aceitacao})
      .andWhere({pergunta_id: dados?.pergunta_id})
      .andWhere({categoria_da_pergunta: dados?.categoria_da_pergunta})
      
      if(resultPergunta.length > 0 ){
        logger("SERVIDOR:postClientes").info(`resposta já configurada para a pergunta`)
        const rs = response("erro", 409, "resposta já configurada para a pergunta");
        return rs
      }
      
      
      await database('reposta_pergunta_categoria').insert(dados)
      
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


module.exports.patchRespostasCategoriazadas = async function(id_resposta, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('reposta_pergunta_categoria').where({id_resposta})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("resposta confiurada não foi encontrado")
      const rs = response("erro", 409, "resposta confiurada não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('reposta_pergunta_categoria').where({id_resposta}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`pergunta_id actualizado com sucesso`)
    const rs = response("sucesso", 202, "pergunta_id actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteRespostasCategoriazadas = async function(id_resposta, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('reposta_pergunta_categoria').where({id_resposta})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("resposta configurada não foi encontrada")
        const rs = response("erro", 409, "resposta configurada não foi encontrada");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('reposta_pergunta_categoria').where({id_resposta}).del() 

      logger("SERVIDOR:deleteClientes").info("resposta exluido com sucesso")
      const rs = response("sucesso", 202, "resposta ao risco exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
