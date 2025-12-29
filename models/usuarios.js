const database = require('../config/database')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const response = require("../constants/response");
const logger = require('../services/loggerService');
const pagination = require("../constants/pagination");
const paginationRecords = require("../helpers/paginationRecords");
const { usuariosFilteres } = require('../helpers/filterResponseSQL');

module.exports.getUsuarios = async function(pagina, limite, total_registros, primeiro_nome_usuario, segundo_nome_usuario, email , acesso, tipo_usuario, cadastrado_em) {
  try {

      logger("SERVIDOR:Clientes").debug("Selecionar da base de dados")
      const usuarios = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .whereLike("primeiro_nome_usuario",`%${primeiro_nome_usuario}%`)
      .whereLike("segundo_nome_usuario",`%${segundo_nome_usuario}%`)
      .whereLike("email_",`%${email}%`)
      .whereLike("acesso",`%${acesso}%`)
      .whereLike("tipo_usuario",`%${tipo_usuario}%`)
      .whereLike("cadastrado_em",`%${cadastrado_em}%`)
      .limit(total_registros || pagination.total_limite)
      .orderBy("id_usuarios", "DESC");

      const {registros} = paginationRecords(usuarios, pagina, limite)

      const usuariosLimite = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .whereLike("primeiro_nome_usuario",`%${primeiro_nome_usuario}%`)
      .whereLike("segundo_nome_usuario",`%${segundo_nome_usuario}%`)
      .whereLike("email_",`%${email}%`)
      .whereLike("acesso",`%${acesso}%`)
      .whereLike("tipo_usuario",`%${tipo_usuario}%`)
      .whereLike("cadastrado_em",`%${cadastrado_em}%`)
      .limit(total_registros || pagination.total_limite)
      .orderBy("id_usuarios", "DESC");

      const filtered = usuariosFilteres(usuariosLimite)
      
      registros.total_apresentados = usuariosLimite.length
      registros.primeiro_nome_usuario = primeiro_nome_usuario
      registros.segundo_nome_usuario = segundo_nome_usuario
      registros.acesso = acesso
      registros.tipo_usuario = tipo_usuario
      registros.cadastrado_em = cadastrado_em
      registros.email = email

      logger("SERVIDOR:getAfiliados").info("Respondeu a requisição");
      const rs = response("sucesso", 200, filtered, 'json', {registros})
      return rs;

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.getUsuariosId = async function(id_usuarios) {
  try {

      const usuarios = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .where({ id_usuarios })
      .orderBy("id_usuarios", "DESC");

      const filtered = usuariosFilteres(usuarios)

      logger("SERVIDOR:getAfiliados").info("Respondeu a requisição");
      const rs = response("sucesso", 200, filtered || {})
      return rs;

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.getUsuariosClintes = async function(usuario_empresa_fk) {
  try {

      const usuarios = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .where({ usuario_empresa_fk })
      .orderBy("id_usuarios", "DESC");

      const filtered = usuariosFilteres(usuarios)

      logger("SERVIDOR:getAfiliados").info("Respondeu a requisição");
      const rs = response("sucesso", 200, filtered)
      return rs;

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.getUsuariosHash = async function(hash) {
  try {

      const usuarios = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .where({ hash_login: hash })
      .andWhere({acesso: 'true'});

      if(usuarios.length == 0 ){
          logger("SERVIDOR:getUsuariosHash").info("Usuario bloquado")
          const rs = response("erro", 403, "Usuario bloquado");
          return rs      
      }else{

          logger("SERVIDOR:getAfiliadosHash").debug("Selecionar da base de dados")
          const acessoUsuario = await database("usuarios")
          .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
          .join("permissoes_usuarios", "permissoes_usuarios.usuario", "=", "usuarios.id_usuarios") 
          .where({ hash_login: hash })

          const [filtered] = usuariosFilteres(acessoUsuario)
        
          logger("SERVIDOR:getAfiliadosHash").info("Respondeu a solicitação")
          const rs = response("sucesso", 202, filtered, "json");          
          return rs 

      }
      

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.getUsuariosPermissoes = async function(id_usuarios) {
  try {
    
      let usuarios = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      //.join("permissoes_usuarios", "permissoes_usuarios.usuario", "=", "usuarios.id_usuarios")
      .where({ id_usuarios })
      .orderBy("id_usuarios", "DESC");

      if(usuarios.length == 0) {
        await database("permissoes_usuarios").insert({ usuario: id_usuarios })
        usuarios = await database("usuarios")
        .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
        //.join("permissoes_usuarios", "permissoes_usuarios.usuario", "=", "usuarios.id_usuarios")
        .where({ id_usuarios })
        .orderBy("id_usuarios", "DESC");
      }

      const filtered = usuariosFilteres(usuarios)

      logger("SERVIDOR:getAfiliados").info("Respondeu a requisição");
      const rs = response("sucesso", 200, filtered)
      return rs;

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.postUsuarios = async function(dados, req) {
  try {

      const resultTipoReg = await database("usuarios").where({
        email_: dados.email_
      });

      if (resultTipoReg.length > 0){
        logger("SERVIDOR:postClientes").info(`Usuario já cadastrado!`)
        const rs = response("erro", 409, "Usuario já cadastrado!");
        return rs
      }

      const resultTipoClientes = await database("clientes").where({
        id_clientes: dados.usuario_empresa_fk
      });

      if (resultTipoClientes.length < 1){
        logger("SERVIDOR:postClientes").info(`Esta empresa não é empresa!`)
        const rs = response("erro", 409, "Esta empresa não é empresa!");
        return rs
      }

      const resultTipoRegTipo = await database("usuarios_funcoes").where({
        id_usuarios_funcoes: dados.tipo_usuario
      }).andWhere({empresa_funcao_fk: dados.usuario_empresa_fk});

      if (resultTipoRegTipo.length < 1){
        logger("SERVIDOR:postClientes").info(`Este tipo de função não é permitido!`)
        const rs = response("erro", 409, "Este tipo de função não é permitido!");
        return rs
      }

      logger("SERVIDOR:Clientes").debug(`Entidade criada com sucesso`)
      await database("usuarios").insert(dados);
      logger("SERVIDOR:Clientes").info(`Usuario cadastrado com sucesso`)
      const rs = response("sucesso", 201, "Usuario cadastrado com sucesso","json",{
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DEFAULT" , tabela: "USUARIOS", informacao: dados, entidade: "01157"}
      });

      return rs

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.postUsuariosLogin = async function({ email_, senha_ }, req) {
  try {
      const result = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .where({ email_ })
      .andWhere({acesso: 'true'});

      if (result.length == 0) {

        logger("SERVIDOR:loginClientes").info("Perfil não encontrados")
        const rs = response("erro", 403, "Perfil não encontrados");
        return rs

      } else {

        if (bcrypt.compareSync(senha_, result[0].senha_)) {
            delete result[0].senha_;

            const login = new Date().toISOString().split('.')[0].replace('T',' ')
                
            logger("SERVIDOR:loginClientes").debug("Actualizar o hash de login")
            await database('usuarios')
            .where({email_}).update({login_usuario: login, hash_login: uuidv4()})

            logger("SERVIDOR:loginClientes").debug("Buscar dados do cliente")
            const [resultNew]  = await database('usuarios').select("hash_login AS hash", "login_usuario AS login")
            .where({email_})

            logger("SERVIDOR:loginClientes").info("Cliente logado com sucesso") 
            const rs = response("sucesso", 202, {hash:resultNew.hash, ultimo_login: resultNew.login}, "json",{
              logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "LOGINUSER" , tabela: "USUARIOS", informacao: {email_}, entidade: "01157"}
            });
            return rs

        } else{
          logger("SERVIDOR:loginClientes").info("Dados não encontrados")
          const rs = response("erro", 401, "Dados não encontrados");
          return rs
        }
  
      }
  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.postUsuariosLogout = async function(id_usuarios, req) {
  try {

      const result = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .where({id_usuarios});

      if (result.length == 0) {

        logger("SERVIDOR:loginClientes").info("Perfil não encontrados")
        const rs = response("erro", 403, "Perfil não encontrados");
        return rs

      }     

      logger("SERVIDOR:loginClientes").info("Sessão terminada com sucesso") 
      const rs = response("sucesso", 202, "Sessão terminada com sucesso", "json",{
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "LOGOUTUSER" , tabela: "USUARIOS", informacao: {dados: result[0]}, entidade: "01157"}
      })

      return rs
      
  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.patchUsuariosPermissoes = async function(id_usuarios, permissoes_usuarios, dados, req) {
  try {

      const result = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .where({id_usuarios});

      if (result.length == 0) {

        logger("SERVIDOR:loginClientes").info("Perfil não encontrados")
        const rs = response("erro", 403, "Perfil não encontrados");
        return rs

      }

      const actualizado_em_p = new Date()
        .toISOString()
        .replace("T", " ")
        .substr(0, 19);

      await database("permissoes_usuarios")
        .where({ usuario: id_usuarios })
        .where({ permissoes_usuarios: permissoes_usuarios })
        .update({ ...dados, actualizado_em_p });

      logger("SERVIDOR:loginClientes").info("Actualização feita com sucesso") 
      const rs = response("sucesso", 202, "Actualização feita com sucesso", "json",{
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DEFAULT" , tabela: "PERMISSES_USUARIOS", informacao: {id_usuarios, ...dados}, entidade: "01157"}
      })

      return rs

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.patchUsuarios = async function(id_usuarios, dados, req) {
  try {

      const result = await database("usuarios")
      .join("usuarios_funcoes", "usuarios_funcoes.id_usuarios_funcoes", "=", "usuarios.tipo_usuario")
      .where({id_usuarios});

      if (result.length == 0) {

        logger("SERVIDOR:loginClientes").info("Perfil não encontrados")
        const rs = response("erro", 403, "Perfil não encontrados");
        return rs

      }

      const resultTipoClientes = await database("clientes").where({
        id_clientes: dados.usuario_empresa_fk
      });

      if (resultTipoClientes.length < 1){
        logger("SERVIDOR:postClientes").info(`Esta empresa não é empresa!`)
        const rs = response("erro", 409, "Esta empresa não é empresa!");
        return rs
      }

      const resultTipoRegTipo = await database("usuarios_funcoes").where({
        id_usuarios_funcoes: dados.tipo_usuario
      }).andWhere({empresa_funcao_fk: dados.usuario_empresa_fk});

      if (resultTipoRegTipo.length < 1){
        logger("SERVIDOR:postClientes").info(`Este tipo de função não é permitido!`)
        const rs = response("erro", 409, "Este tipo de função não é permitido!");
        return rs
      }

      const actualizado_em = new Date()
        .toISOString()
        .replace("T", " ")
        .substr(0, 19);

      await database("usuarios")
        .where({ id_usuarios })
        .update({ ...dados, actualizado_em });
      
      logger("SERVIDOR:loginClientes").info("Actualização feita com sucesso") 
      const rs = response("sucesso", 202, "Actualização feita com sucesso", "json",{
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DEFAULT" , tabela: "USUARIOS", informacao: {id_usuarios, ...dados}, entidade: "01157"}
      })

      return rs

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};

module.exports.deleteUsuarios = async function(id_usuarios, req) {
  try {

      const dados = await database("usuarios").where({ id_usuarios })

      if (dados.length == 0) {

        logger("SERVIDOR:loginClientes").info("Perfil não encontrados")
        const rs = response("erro", 403, "Perfil não encontrados");
        return rs

      }

      await database("usuarios").where({ id_usuarios }).del();

      logger("SERVIDOR:loginClientes").info("Usuario excluido feita com sucesso") 
      const rs = response("sucesso", 202, "Usuario excluido feita com sucessoo", "json",{
        logs: {ip: req.ip, verbo_rota_API: req.method, rota_API: req.originalUrl, tipo: "DEFAULT" , tabela: "USUARIOS", informacao: {id_usuarios, ...dados[0]}, entidade: "01157"}
      })

      return rs

  } catch (error) {
      console.log(error)
      logger("SERVIDOR:Clientes").error(`Erro ao buscar clientes ${error.message}`)
      const rs = response("erro", 400, 'Algo aconteceu. Tente de novo');
      return rs
  }
};
