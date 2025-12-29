const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getListaCategoriaSubAoRisco = async function(pagina, limite, descricao_categoria_sub, categoria_de_risco_id_fk) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('lista_categoria_sub_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","lista_categoria_sub_de_risco.categoria_de_risco_id_fk")
      .whereLike("descricao_categoria_sub",`%${descricao_categoria_sub}%`)
      //.whereLike("cliente_categorizado_fk",`%${cliente_categorizado_fk}%`)
      .whereLike("categoria_de_risco_id_fk",`%${categoria_de_risco_id_fk}%`)
      .orderBy('id_lista_categoria_sub_de_risco','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('lista_categoria_sub_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","lista_categoria_sub_de_risco.categoria_de_risco_id_fk")
      .whereLike("descricao_categoria_sub",`%${descricao_categoria_sub}%`)
      //.whereLike("cliente_categorizado_fk",`%${cliente_categorizado_fk}%`)
      //.whereLike("categoria_de_risco_id_fk",`%${categoria_de_risco_id_fk}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_lista_categoria_sub_de_risco','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.descricao_categoria_sub = descricao_categoria_sub
      //registros.cliente_categorizado_fk = cliente_categorizado_fk
      registros.categoria_de_risco_id_fk = categoria_de_risco_id_fk

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

module.exports.getListaCategoriaSubAoRiscoId = async function(id_lista_categoria_sub_de_risco) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [lista_categoria_sub_de_risco] = await database('lista_categoria_sub_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","lista_categoria_sub_de_risco.categoria_de_risco_id_fk")
      .where({id_lista_categoria_sub_de_risco})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, lista_categoria_sub_de_risco || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesListaCategoriaSubAoRisco = async function(categoria_de_risco_id_fk) {
  try {

      logger("SERVIDOR:getClientesEntidade").debug("Á buscar os dados")
      const lista_categoria_sub_de_risco = await database('lista_categoria_sub_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","lista_categoria_sub_de_risco.categoria_de_risco_id_fk")
      .where({categoria_de_risco_id_fk})
      .orderBy('id_lista_categoria_sub_de_risco','DESC')  
    
      logger("SERVIDOR:getClientesEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, lista_categoria_sub_de_risco, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getClientesEntidade").error(`Erro ao buscar clientes por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getClientesCategoriaDefinidoSubAoRisco = async function(categoria_de_risco_id_fk, cliente_categorizado_fk) {
  try {

      logger("SERVIDOR:getClientesEntidade").debug("Á buscar os dados")
      const lista_categoria_sub_de_risco = await database('lista_categoria_sub_de_risco')
      .join('lista_de_categoria_de_risco',"lista_de_categoria_de_risco.id_lista_de_categoria_de_risco","=","lista_categoria_sub_de_risco.categoria_de_risco_id_fk")
      .where({categoria_de_risco_id_fk})
      //.andWhere({cliente_categorizado_fk})
      .orderBy('id_lista_categoria_sub_de_risco','DESC')  
    
      logger("SERVIDOR:getClientesEntidade").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, lista_categoria_sub_de_risco, "json");          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:getClientesEntidade").error(`Erro ao buscar clientes por entidade ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postListaCategoriaSubAoRisco = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      /*const resultCliente  = await database('clientes')
      .where({id_clientes: dados?.cliente_categorizado_fk})
      
      if(!resultCliente.length){
        logger("SERVIDOR:postClientes").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Cliente inexistente");
        return rs
      }*/

      const resultCategoria  = await database('lista_de_categoria_de_risco')
      .where({id_lista_de_categoria_de_risco: dados?.categoria_de_risco_id_fk})
      
      if(!resultCategoria.length){
        logger("SERVIDOR:postClientes").info(`Cliente Inexistente`)
        const rs = response("erro", 409, "Categoria do cliente inexistente");
        return rs
      }
      
      const resultEnt  = await database('lista_categoria_sub_de_risco')
      .where({categoria_de_risco_id_fk: dados?.categoria_de_risco_id_fk})
      .andWhere({descricao_categoria_sub: dados?.descricao_categoria_sub})
      
      if(resultEnt.length > 0 ){
        logger("SERVIDOR:postClientes").info(`Configuração usada`)
        const rs = response("erro", 409, "Configuração usada");
        return rs
      }
      
      
      await database('lista_categoria_sub_de_risco').insert(dados)
      
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


module.exports.patchListaCategoriaSubAoRisco = async function(id_lista_categoria_sub_de_risco, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('lista_categoria_sub_de_risco').where({id_lista_categoria_sub_de_risco})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("sub categoria ao risco configurado não foi encontrado")
      const rs = response("erro", 409, "sub categoria ao risco configurado não foi encontrado");
      return rs    
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('lista_categoria_sub_de_risco').where({id_lista_categoria_sub_de_risco}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`sub categoria ao risco actualizado com sucesso`)
    const rs = response("sucesso", 202, "sub categoria ao risco actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteListaCategoriaSubAoRisco = async function(id_lista_categoria_sub_de_risco, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('lista_categoria_sub_de_risco').where({id_lista_categoria_sub_de_risco})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("sub catergoria ao risco configurado não foi encontrado")
        const rs = response("erro", 409, "sub catergoria ao risco configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o cliente`)
      await database('lista_categoria_sub_de_risco').where({id_lista_categoria_sub_de_risco}).del() 

      logger("SERVIDOR:deleteClientes").info("Sub categoria ao risco exluido com sucesso")
      const rs = response("sucesso", 202, "Sub csategoria ao risco exluido com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
