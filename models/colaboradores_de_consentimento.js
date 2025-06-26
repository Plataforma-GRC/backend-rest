const database = require('../config/database')
const path = require("path");
const response = require("../constants/response");
const logger = require('../services/loggerService');
const paginationRecords = require("../helpers/paginationRecords")
const { clientesTruesFilteres } = require('../helpers/filterResponseSQL');
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });

module.exports.getColaboradoresConsentimentos = async function(pagina, limite, empresa_id, departamento_id, nome_colaborador, telefone, cargo) {
  try {
      
      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")

      const clientes = await database('colaboradores_de_consentimento_das_categorias')
      .whereLike("departamento_id",`%${departamento_id}%`)
      .whereLike("empresa_id",`%${empresa_id}%`)
      .whereLike("nome_colaborador",`%${nome_colaborador}%`)
      .whereLike("telefone",`%${telefone}%`)
      .whereLike("cargo",`%${cargo}%`)
      .orderBy('id_colaborador_de_consentimento','DESC')

      const {registros} = paginationRecords(clientes, pagina, limite)

      logger("Clientes").debug(`Buscar todos clientes no banco de dados com limite de ${registros.limite} na pagina ${registros.count} de registros`);
      const clientesLimite = await database('colaboradores_de_consentimento_das_categorias')
      .whereLike("departamento_id",`%${departamento_id}%`)
      .whereLike("empresa_id",`%${empresa_id}%`)
      .whereLike("nome_colaborador",`%${nome_colaborador}%`)
      .whereLike("telefone",`%${telefone}%`)
      .whereLike("cargo",`%${cargo}%`)
      .limit(registros.limite)
      .offset(registros.count)
      .orderBy('id_colaborador_de_consentimento','DESC')

      const filtered = clientesTruesFilteres(clientesLimite)

      registros.total_apresentados = clientesLimite.length
      registros.departamento_id = departamento_id
      registros.empresa_id = empresa_id
      registros.nome_colaborador = nome_colaborador
      registros.telefone = telefone
      registros.cargo = cargo

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

module.exports.getColaboradoresConsentimentosId = async function(id_colaborador_de_consentimento) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const [colaboradores_de_consentimento_das_categorias] = await database('colaboradores_de_consentimento_das_categorias')
      .where({id_colaborador_de_consentimento})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, colaboradores_de_consentimento_das_categorias || {});          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getColaboradoresConsentimentosPorEmpresa = async function(empresa_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const colaboradores_de_consentimento_das_categorias = await database('colaboradores_de_consentimento_das_categorias')
      .where({empresa_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, colaboradores_de_consentimento_das_categorias);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getColaboradoresConsentimentosRespostaEmpresa = async function(empresa_id) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const colaboradores_de_consentimento_respostas = await database('colaboradores_de_consentimento_respostas')
      .join('colaboradores_de_consentimento_das_categorias',"colaboradores_de_consentimento_das_categorias.id_colaborador_de_consentimento","=","colaboradores_de_consentimento_respostas.colaborador_consentimento")
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","colaboradores_de_consentimento_respostas.pergunta_catagorizada")
      .join('reposta_pergunta_categoria',"reposta_pergunta_categoria.id_resposta","=","colaboradores_de_consentimento_respostas.resposta_categorizada")
      .where({empresa_parametrizada: empresa_id})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, colaboradores_de_consentimento_respostas);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getColaboradoresConsentimentosResostaEmpresaColaborador = async function(empresa_id, id_colaborador_de_consentimento_resposta) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const colaboradores_de_consentimento_respostas = await database('colaboradores_de_consentimento_respostas')
      .join('colaboradores_de_consentimento_das_categorias',"colaboradores_de_consentimento_das_categorias.id_colaborador_de_consentimento","=","colaboradores_de_consentimento_respostas.colaborador_consentimento")
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","colaboradores_de_consentimento_respostas.pergunta_catagorizada")
      .join('reposta_pergunta_categoria',"reposta_pergunta_categoria.id_resposta","=","colaboradores_de_consentimento_respostas.resposta_categorizada")
      .where({empresa_parametrizada: empresa_id})
      .andWhere({colaborador_consentimento: id_colaborador_de_consentimento_resposta})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, colaboradores_de_consentimento_respostas);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.getColaboradoresConsentimentosResostaEmpresaCategoria = async function(empresa_id, categoria_da_pergunta) {
  try {

      logger("SERVIDOR:ClientesId").debug("Selecionar da base de dados")
      const colaboradores_de_consentimento_respostas = await database('colaboradores_de_consentimento_respostas')
      .join('colaboradores_de_consentimento_das_categorias',"colaboradores_de_consentimento_das_categorias.id_colaborador_de_consentimento","=","colaboradores_de_consentimento_respostas.colaborador_consentimento")
      .join('perguntas_categorias',"perguntas_categorias.id_pergunta","=","colaboradores_de_consentimento_respostas.pergunta_catagorizada")
      .join('reposta_pergunta_categoria',"reposta_pergunta_categoria.id_resposta","=","colaboradores_de_consentimento_respostas.resposta_categorizada")
      .where({empresa_parametrizada: empresa_id})
      .andWhere({categoria_da_pergunta})
    
      logger("SERVIDOR:ClientesId").info("Respondeu a solicitação")
      const rs = response("sucesso", 200, colaboradores_de_consentimento_respostas);          
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:ClientesId").error(`Erro ao buscar clientes por ID ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}

module.exports.postColaboradoresConsentimentos = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const clientes = await database('clientes')
      .where({id_clientes: dados?.empresa_id})
      
      if(!clientes.length){
        logger("SERVIDOR:postClientes").info(`Registro de empresa ou cliente não foram encontrados`)
        const rs = response("erro", 409, "Registro de empresa ou cliente não foram encontrados");
        return rs
      }
      
      const clientesDepartamento = await database('departamento_clientes')
      .where({id_departamento: dados?.departamento_id})
      .andWhere({empresa_dona: dados?.empresa_id})
      
      if(!clientesDepartamento.length){
        logger("SERVIDOR:postClientes").info(`Registro de colaborador assossiado não foram encontrados`)
        const rs = response("erro", 409, "Registro de colaborador assossiado não foram encontrados");
        return rs
      }
      
      const resultEnt  = await database('colaboradores_de_consentimento_das_categorias')
      .where({departamento_id: dados?.departamento_id})
      .andWhere({empresa_id: dados?.empresa_id})
      .andWhere({telefone: dados?.telefone})
      .andWhere({cargo: dados?.cargo})
      .andWhere({nome_colaborador: dados?.nome_colaborador})
      
      if(resultEnt.length > 0){
        logger("SERVIDOR:postClientes").info(`colaborador  já configurado para a empresa`)
        const rs = response("erro", 409, "colaborador  já configurado para a empresa");
        return rs
      }
      
      
      await database('colaboradores_de_consentimento_das_categorias').insert(dados)
      
      logger("SERVIDOR:Clientes").info(`Colaborador criado com sucesso`)
      const rs = response("sucesso", 201, "Colaborador criado com sucesso","json",{
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

module.exports.postColaboradoresConsentimentosRespostas = async function(dados, req) {

    try {

      logger("SERVIDOR:postClientes").debug(`Verificar o cliente por email`)
      
      const clientes = await database('clientes')
      .where({id_clientes: dados?.empresa_parametrizada})
      
      if(!clientes.length){
        logger("SERVIDOR:postClientes").info(`Registro de empresa ou cliente não foram encontrados`)
        const rs = response("erro", 409, "Registro de empresa ou cliente não foram encontrados");
        return rs
      }
      
      const verificarPergunta = await database('perguntas_categorias')
      .where({id_pergunta: dados?.pergunta_catagorizada})
      
      if(!verificarPergunta.length){
        logger("SERVIDOR:postClientes").info(`Registro da questão não foi escolhida`)
        const rs = response("erro", 409, "Registro da questão não foi escolhida");
        return rs
      }
      
      const verificarResposta = await database('reposta_pergunta_categoria')
      .where({id_resposta: dados?.resposta_categorizada})
      .andWhere({pergunta_id: dados?.pergunta_catagorizada})
      
      if(!verificarResposta.length){
        logger("SERVIDOR:postClientes").info(`Registro da resposta á essa pergunta não foi parametrizada`)
        const rs = response("erro", 409, "Registro da resposta á essa pergunta não foi parametrizada");
        return rs
      }
      
      const verificarUnicaResposta = await database('colaboradores_de_consentimento_respostas')
      .where({pergunta_catagorizada: dados?.pergunta_catagorizada})
      .andWhere({colaborador_consentimento: dados?.colaborador_consentimento})
      .andWhere({empresa_parametrizada: dados?.empresa_parametrizada})
      
      if(verificarUnicaResposta.length > 0){
        logger("SERVIDOR:postClientes").info(`O colaborador já respondeu a essa questão`)
        const rs = response("erro", 409, "O colaborador já respondeu a essa questão");
        return rs
      }
      
      const resultEnt  = await database('colaboradores_de_consentimento_respostas')
      .where({pergunta_catagorizada: dados?.pergunta_catagorizada})
      .andWhere({resposta_categorizada: dados?.resposta_categorizada})
      .andWhere({empresa_parametrizada: dados?.empresa_parametrizada})
      .andWhere({colaborador_consentimento: dados?.colaborador_consentimento})
      
      if(resultEnt.length > 0){
        logger("SERVIDOR:postClientes").info(`colaborador  já configurado para a empresa`)
        const rs = response("erro", 409, "colaborador  já configurado para a empresa");
        return rs
      }
      
      
      await database('colaboradores_de_consentimento_respostas').insert(dados)
      
      logger("SERVIDOR:Clientes").info(`Colaborador criado com sucesso`)
      const rs = response("sucesso", 201, "Colaborador criado com sucesso","json",{
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


module.exports.patchColaboradoresConsentimentos = async function(id_colaborador_de_consentimento, dados, req) { 

  try {

    logger("SERVIDOR:patchClientes").debug(`Verificar se é um  cliente do serviço GPO`)
    const catergoriaVerify = await database('colaboradores_de_consentimento_das_categorias').where({id_colaborador_de_consentimento})

    if(!catergoriaVerify.length){
      logger("SERVIDOR:patchClientes").info("colaborador não foi encontrado")
      const rs = response("erro", 409, "colaborador não foi encontrado");
      return rs    
    }
    
    const clientesDepartamento = await database('departamento_clientes')
    .andWhere({empresa_dona: dados?.empresa_id})
    
    if(!clientesDepartamento.length){
      logger("SERVIDOR:postClientes").info(`Registro de colaborador assossiado não foram encontrados`)
      const rs = response("erro", 409, "Registro de colaborador assossiado não foram encontrados");
      return rs
    }
    
    logger("SERVIDOR:patchClientes").debug(`Actualizado o cliente`)
    await database('colaboradores_de_consentimento_das_categorias').where({id_colaborador_de_consentimento}).update({...dados})

    logger("SERVIDOR:patchClientes").info(`colaborador actualizado com sucesso`)
    const rs = response("sucesso", 202, "colaborador actualizado com sucesso");
    return rs
    
  } catch (erro) {
    console.log(erro)
    logger("SERVIDOR:patchClientes").error(`Erro ao buscar clientes ${erro.message}`)
    const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
    return rs
  }
    
}

module.exports.deleteColaboradoresConsentimentos = async function(id_colaborador_de_consentimento, req) { 
  try {

      logger("SERVIDOR:deleteClientes").debug(`Verificar se o clientes é do serviço GPO`)
      const catergoriaVerify = await database('colaboradores_de_consentimento_das_categorias').where({id_colaborador_de_consentimento})

      if(!catergoriaVerify.length){
        logger("SERVIDOR:patchClientes").info("colaborador configurado não foi encontrado")
        const rs = response("erro", 409, "colaborador configurado não foi encontrado");
        return rs    
      }

      logger("SERVIDOR:deleteClientes").debug(`Á apagar o colaborador`)
      await database('colaboradores_de_consentimento_das_categorias').where({id_colaborador_de_consentimento}).del() 

      logger("SERVIDOR:deleteClientes").info("colaborador exluida com sucesso")
      const rs = response("sucesso", 202, "colaborador exluida com sucesso");
      return rs

  } catch (erro) {
      console.log(erro)
      logger("SERVIDOR:Clientes").error(`Erro ao deletar o cliente  ${erro.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
    
}
