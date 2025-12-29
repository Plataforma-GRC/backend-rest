const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getUsuariosFuncoes = async function(pagina, limite, usuario_funcao, empresa_funcao_fk) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('usuarios_funcoes')
      .join('clientes',"clientes.id_clientes","=","usuarios_funcoes.empresa_funcao_fk")
      .whereLike("usuario_funcao",`%${usuario_funcao}%`)
      .whereLike("empresa_funcao_fk",`%${empresa_funcao_fk}%`)
      .orderBy('id_usuarios_funcoes','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('usuarios_funcoes')
      .join('clientes',"clientes.id_clientes","=","usuarios_funcoes.empresa_funcao_fk")
      .whereLike("usuario_funcao",`%${usuario_funcao}%`)
      .whereLike("empresa_funcao_fk",`%${empresa_funcao_fk}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_usuarios_funcoes','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.empresa_funcao_fk = usuario_funcao
      registros.empresa_funcao_fk = empresa_funcao_fk

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

module.exports.getUsuariosFuncoesId = async function(id_usuarios_funcoes) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [usuarios_funcoes] = await database('usuarios_funcoes')
      .join('clientes',"clientes.id_clientes","=","usuarios_funcoes.empresa_funcao_fk")
      .where({id_usuarios_funcoes})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, usuarios_funcoes || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesUsuariosFuncoes = async function(empresa_funcao_fk) {
  try {

      logger("SERVIDOR:getClientesEntidade").debug("Á buscar os dados")
      const usuarios_funcoes = await database('usuarios_funcoes')
      .join('clientes',"clientes.id_clientes","=","usuarios_funcoes.empresa_funcao_fk")
      .where({empresa_funcao_fk})
      .orderBy('id_usuarios_funcoes','DESC')  
    
      logger("SERVIDOR:getClientesEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, usuarios_funcoes, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getClientesEntidade").error(`Erro ao buscar clientes por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postUsuariosFuncoes = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const resultCliente  = await database('clientes')
      .where({id_clientes: dados?.empresa_funcao_fk})
      
      if(!resultCliente.length){
        logger("SERVIDOR:postClientes").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Cliente inexistente");
        return rs
      }
      
      const resultEnt  = await database('usuarios_funcoes')
      .where({empresa_funcao_fk: dados?.empresa_funcao_fk})
      .andWhere({usuario_funcao: dados?.usuario_funcao})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('usuarios_funcoes').insert(dados)
      
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


module.exports.patchUsuariosFuncoes = async function(id_usuarios_funcoes, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('usuarios_funcoes').where({id_usuarios_funcoes})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("categoria ao risco configurado não foi encontrado")
      const rs = response("erro", 409, "categoria ao risco configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('usuarios_funcoes').where({id_usuarios_funcoes}).update({...dados})

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

module.exports.deleteUsuariosFuncoes = async function(id_usuarios_funcoes, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('usuarios_funcoes').where({id_usuarios_funcoes})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("catergoria ao risco configurado não foi encontrado")
        const rs = response("erro", 409, "catergoria ao risco configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('usuarios_funcoes').where({id_usuarios_funcoes}).del() 

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
