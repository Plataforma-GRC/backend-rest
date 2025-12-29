const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { riscosTruesFilteres } = require('../helpers/filterResponseSQL');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getRiscos = async function(pagina, limite, codigo_risco, titulo, descricao_risco, causa, consequencia, score, responsavel, status_riscos, risco_time) {
  try {
      
      logger("SERVIDOR:riscos").debug("Selecionar da base de dados")

      const riscos = await database('riscos')
      .whereLike("codigo_risco",`%${codigo_risco}%`)
      .whereLike("titulo",`%${titulo}%`)
      .whereLike("descricao_risco",`%${descricao_risco}%`)
      .whereLike("causa",`%${causa}%`)
      .whereLike("consequencia",`%${consequencia}%`)
      .whereLike("score",`%${score}%`)
      .whereLike("responsavel",`%${responsavel}%`)
      .whereLike("status_riscos",`%${status_riscos}%`)
      .whereLike("risco_time",`%${risco_time}%`)
      .orderBy('riscos_id','DESC')

      const {registros} = paginationRecords(riscos, pagina, limite)

      logger("riscos").debug(`Buscar todos riscos no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const riscosLimite = await database('riscos')
      .whereLike("codigo_risco",`%${codigo_risco}%`)
      .whereLike("titulo",`%${titulo}%`)
      .whereLike("descricao_risco",`%${descricao_risco}%`)
      .whereLike("causa",`%${causa}%`)
      .whereLike("consequencia",`%${consequencia}%`)
      .whereLike("score",`%${score}%`)
      .whereLike("responsavel",`%${responsavel}%`)
      .whereLike("status_riscos",`%${status_riscos}%`)
      .whereLike("risco_time",`%${risco_time}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('riscos_id','DESC')

      const filtered = riscosTruesFilteres(riscosLimite)

      registros.total_apresentados = riscosLimite.length
      registros.codigo_risco = codigo_risco
      registros.titulo = titulo
      registros.descricao_risco = descricao_risco
      registros.causa = causa
      registros.consequencia = consequencia
      registros.score = score
      registros.responsavel = responsavel
      registros.status_riscos = status_riscos
      registros.risco_time = risco_time

      logger("SERVIDOR:riscos").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, filtered, "json", { registros });
      return rs


  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:riscos").error(`Erro ao buscar riscos ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getRiscosId = async function(riscos_id) {
  try {

      logger("SERVIDOR:riscosId").debug("Selecionar da base de dados")
      const [riscos] = await database('riscos')
      .where({riscos_id})
    
      logger("SERVIDOR:riscosId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, riscos || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:riscosId").error(`Erro ao buscar riscos por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesRiscos = async function(empresa_id) {
  try {

      logger("SERVIDOR:getriscosEntidade").debug("Á buscar os dados")
      const riscos = await database('riscos')
      .where({empresa_id})
      .orderBy('riscos_id','DESC')  
    
      logger("SERVIDOR:getriscosEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, riscos, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getriscosEntidade").error(`Erro ao buscar riscos por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postRiscos = async function(dados, req) {

    try {

      logger("SERVIDOR:postriscos").debug(`Verificar o cliente por email`)
      
      const resultCliente  = await database('clientes')
      .where({id_clientes: dados?.empresa_id})
      
      if(!resultCliente.length){
        logger("SERVIDOR:postriscos").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Cliente inexistente");
        return rs
      }

      const resultCategoria  = await database('categoria_de_risco')
      .where({id_categoria_de_risco: dados?.categoria_risco_fk_id})
      .andWhere({cliente_categorizado: dados?.empresa_id})
      
      if(!resultCategoria.length){
        logger("SERVIDOR:postClientes").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Categoria do cliente inexistente");
        return rs
      }
      
      const resultEnt  = await database('riscos')
      .where({empresa_id: dados?.empresa_id})
      .andWhere({titulo: dados?.titulo})
      .andWhere({categoria_risco_fk_id: dados?.categoria_risco_fk_id})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postriscos").info(`Risco já foi cadastrado`)
        const rs = response("erro", 409, "Risco já foi cadastrado");
        return rs
      }
      
      
      await database('riscos').insert({...dados, codigo_risco: uuidv4()})
      
      logger("SERVIDOR:riscos").info(`Risco criada com sucesso`)
      const rs = response("sucesso", 201, "Risco criada com sucesso","json",{
        info: dados
      });

      return rs
      
    } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:riscos").error(`Erro ao cadastrar o cliente ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
    }
    
}


module.exports.patchRiscos = async function(riscos_id, dados, req) { 

  try {

    logger("SERVIDOR:patchriscos").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('riscos').where({riscos_id})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchriscos").info("Parametrização  configurado não foi encontrado")
      const rs = response("erro", 409, "Parametrização  configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchriscos").debug(`Actualizado o cliente`)
    await database('riscos').where({riscos_id}).update({...dados})

    logger("SERVIDOR:patchriscos").info(`Parametrização  actualizada com sucesso`)
    const rs = response("sucesso", 202, "Parametrização  actualizada com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchriscos").error(`Erro ao buscar riscos ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteRiscos = async function(riscos_id, req) { 
  try {

      logger("SERVIDOR:deleteriscos").debug(`Verificar se o riscos é do serviço GPO`)
      const catergoriaVerify = await database('riscos').where({riscos_id})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchriscos").info("Parametrização  configurada não foi encontrado")
        const rs = response("erro", 409, "Parametrização  configurada não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteriscos").debug(`Á apagar o cliente`)
      await database('riscos').where({riscos_id}).del() 

      logger("SERVIDOR:deleteriscos").info("Parametrização  exluido com sucesso")
      const rs = response("sucesso", 202, "Parametrização  exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:riscos").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
