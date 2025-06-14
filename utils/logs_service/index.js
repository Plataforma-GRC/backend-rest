const save = require("./saveRegister");
const saveNotification = require("./saveNotification");
module.exports = async dados => { 
  const EVENTS = {
    DEFAULT: "PELO ADMINISTRADOR",
    GET: "BUSCA",
    POST: "INSERÇÃO / CONFIGURAÇÃO",
    PAYMENTREALTIME: "NOTIFICAÇÃO DE PAGAMENTO EM TEM REAL",
    PAYMENTCONCILIATION: "CONCLIAÇÃO BACARIA DE PAGAMENTO",
    ACTIVEREFERENCIAS: "REFERENCIAS GERADAS E ACTIVAS",
    DESACTIVEREFERENCIAS: "REFERENCIAS GERDAS MAS DESACTIVADAS",
    DESATIVE: "BLOQUEIO DE PERFIL, PELO ADMINISTRADOR",
    ACTIVE: "DESBLOQUEIO DE PERFIL, PELO ADMINISTRADOR",
    BLOCK: "BLOQUEIO DE PERFIL",
    UNBLOCK: "DESBLOQUEIO DE PERFIL",
    RESETPASSWPRD: "REDIFINIÇÃO DE SENHA",
    SENDSECURITYCODE: "ENVIO DE CODIGO DE SEGURANÇA. PARA REDIFINIR SENHA",
    SECURITYCODEEXPIRE: "CODIGO DE SEGURANÇA EXPIRADO",
    SECURITYCODEUSED: "CODIGO DE SEGURANÇA USADO",
    UPDATEPASSWORD: "ACTUALIZAÇÃO DE SENHA",
    LOGINFORCE: "LOG IN FORÇADO, USUARIO BLOQUEADO",
    LOGIN: "LOG IN, CLIENTE",
    LOGINUSER: "LOG IN, USUARIO",
    LOGOUT: "LOG OUT, CLIENTE",
    LOGOUTUSER: "LOG OUT, USUARIO",
    LOGOUTFORCE: "LOG OUT FORÇADO, DUAS SESSÕES ABERTAS",
    LOGOUTFORCEBLOCK: "LOG OUT FORÇADO, PELO ADMINISTRADOR. USUARIO BLOQUEADO",
    PATCH: "ACTUALIZAÇÃO",
    DELETE: "EXCLUSÃO",
    ENVIEEMAIL: "ENVIO DE EMAIL",
    ACTIVESECTORPAYMENT: "ATIVAÇÃO DO SERVICO DE PAGAMENTO POR SECTOR",
    DESACTIVESECTORPAYMENT: "DESATIVAÇÃO DO SERVICO DE PAGAMENTO POR SECTOR",
    ACTIVEGPO: "ATIVAÇÃO DO SERVICO GPO",
    DESACTIVEGPO: "DESATIVAÇÃO DO SERVICO GPO",
    PAYMENTEREALTIMEACTIVE: "ACTIVAÇÂO DA NOTIFICAÇÃO DE PAGAMENTO EM TEMPO REAL",
    PAYMENTEREALTIMEDESACTIVE: "DESATIVAÇÃO DA NOTIFICAÇÃO DE PAGAMENTO EM TEMPO REAL",
    WEBHOOKACTIVE: "ACTIVAÇÂO DA INTEGRAÇÃO WEBHOOK",
    WEBHOOKDESACTIVE: "DESATIVAÇÃO DA INTEGRAÇÃO WEBHOOK",
    IPACCEPTS: "IP(s), Parametrizado(s) e a serem validados",
  };

  const {
    tipo,
    tabela,
    entidade,
    ip,
    informacao,
    rota_API,
    verbo_rota_API
  } = dados;


  if (EVENTS[tipo]) {
    const descricao = EVENTS[tipo];
    await save({ ...dados, descricao });

    if (tipo === "BLOCK") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Ola!  Seu perfil foi bloqueado, por motivos á explicar. Caso seja um engano, por favor entre em contacto com o administrador",
        estado: "error"
      });
    } else if (tipo === "LOGIN") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado: "Realizamos seu login com sucesso",
        estado: "info"
      });
    } else if (tipo === "LOGINFORCE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Seu perfil se encontra bloqueado, mas temos um usuario tentanto entrar",
        estado: "info"
      });
    } else if (tipo === "LOGOUTFORCE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Seu perfil foi terminado a sessão em outra maquina, Não se pode ter o mesmo usuario activo em maquinas diferentes",
        estado: "warning"
      });
    }else if (tipo === "ACTIVEREFERENCIAS") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Suas referência(s) foram activadas com sucesso",
        estado: "success"
      });
    }else if (tipo === "DESACTIVEREFERENCIAS") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Suas referência(s) foram desactivadas com sucesso",
        estado: "error"
      });

    }else if (tipo === "UNBLOCK") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Seu perfil está activo novamente. Contacte o administrador caso não saiba do acontecido",
        estado: "success"
      });
    }else if (tipo === "ACTIVE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Seu perfil foi desbloqueado pelo administrador",
        estado: "success"
      });
    }else if (tipo === "DESATIVE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Seu perfil foi bloqueado pelo administrador",
        estado: "error"
      });
    }else if (tipo === "RESETPASSWPRD") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Sua senha foi redifinida com sucesso",
        estado: "success"
      });
    }else if (tipo === "SENDSECURITYCODE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Enviamos um codigo de segurança em seu email para redifinição de senha",
        estado: "info"
      });
    }else if (tipo === "UPDATEPASSWORD") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Sua senha foi actualizada com sucesso",
        estado: "success"
      });
    }else if (tipo === "LOGOUTFORCEBLOCK") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Tivemos que bloquear seu perfil! Caso precise de um esclarecimento contacte o administrador",
        estado: "warning"
      });
    }else if (tipo === "ACTIVESECTORPAYMENT") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Acabamos de activar o serviço de pagamento por referÊncia",
        estado: "success"
      });
    }else if (tipo === "DESACTIVESECTORPAYMENT") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
          "Desactivamos o serviço de pagamento por referência",
        estado: "error"
      });
    }else if (tipo === "ACTIVEGPO") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Acabamos de activar o serviço GPO",
        estado: "success"
      });
    }else if (tipo === "DESACTIVEGPO") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Desactivamos o serviço GPO",
        estado: "error"
      });
    }else if (tipo === "PAYMENTEREALTIMEACTIVE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Activamos a notificação de pagamento em tempo real",
        estado: "info"
      });
    }else if (tipo === "PAYMENTEREALTIMEDESACTIVE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Desactivamos a notificação de pagamento em tempo real",
        estado: "warning"
      });
    }else if (tipo === "WEBHOOKACTIVE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Activamos e habilitamos integração via webhook",
        estado: "info"
      });
    }else if (tipo === "WEBHOOKDESACTIVE") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Desactivamos e desabilitamos integração via webhook",
        estado: "warning"
      });
    }else if (tipo === "IPACCEPTS") {
      await saveNotification({
        entidade_notificada: entidade,
        papel_notificado: tipo,
        descricao_notificado:
        "Seu(s) foram parametrizados ou permitidos em uso da API da INTELIZE PAGAMENTOS",
        estado: "info"
      });
    }
  }
};
