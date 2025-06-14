const {
  transport: transportador,
  smtpConfig
} = require("../../config/transportadorSMTP");

module.exports.comunicarEmail = async (assunto, email, html) => {
  try {
    await transportador.sendMail({
      from: `"${smtpConfig.nome}" <${smtpConfig.usuario}>`,
      to: email,
      subject: assunto,
      // text: `Caro(a) cliente para redifinição de sua senha deverá introduzir o codigo de segurança: ${codigo_seguranca}`,
      html,
      headers: { "x-myheader": "test header" }
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.codigoSeguranca = async (empresa, email, codigo_seguranca) => {
  try {
    await transportador.sendMail({
      from: `"${smtpConfig.nome}" <${smtpConfig.usuario}>`,
      to: email,
      subject: "Redifinição de senha - INTELIZE INVESTIMENTOS",
      // text: `Caro(a) cliente para redifinição de sua senha deverá introduzir o codigo de segurança: ${codigo_seguranca}`,
      html: `<p>Olá <b>${empresa}</b>,<br/>
            Recentemente, você solicitou a redefinição da senha da sua conta <b style="color: rgb(38, 38, 173);">INTELIZE PAGAMENTOS</b>. Introduza o seguinte código na pagina aberta.</p>
            
            <h1>${codigo_seguranca}</h1>
            
            <p>
            Se você não solicitou uma redefinição de senha, ignore este e-mail ou responda para nos informar. Este código de redefinição de senha é válido apenas pelos próximos 10 minutos.
            </p>
            <p>
            Obrigado, equipe da <b>INTELIZE INVESTIMENTOS</b>
            </p>`,
      headers: { "x-myheader": "test header" }
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.bloququeioDeConta = async (empresa, email) => {
  try {
    await transportador.sendMail({
      from: `"${smtpConfig.nome}" <${smtpConfig.usuario}>`,
      to: email,
      subject: "Bloqueio de perfil - INTELIZE INVESTIMENTOS",
      // text: `Caro(a) cliente para redifinição de sua senha deverá introduzir o codigo de segurança: ${codigo_seguranca}`,
      html: `<p>Olá <b>${empresa}</b>,<br/>
            Viemos por este meio notificar que sua conta da <b style="color: rgb(38, 38, 173);">INTELIZE PAGAMENTOS</b> está bloqueada. Gastou suas tentativas de acesso.</p>
            <p>
            Se você não foi quem tentava entrar no perfil, entre em contacto com administrador.
            </p>
            <p>
            Obrigado, equipe da <b>INTELIZE INVESTIMENTOS</b>
            </p>`,
      headers: { "x-myheader": "test header" }
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.bloququeioDeContaADM = async (empresa, email) => {
  try {
    await transportador.sendMail({
      from: `"${smtpConfig.nome}" <${smtpConfig.usuario}>`,
      to: email,
      subject: "Bloqueio de perfil - INTELIZE INVESTIMENTOS",
      // text: `Caro(a) cliente para redifinição de sua senha deverá introduzir o codigo de segurança: ${codigo_seguranca}`,
      html: `<p>Olá <b>${empresa}</b>,<br/>
            Viemos por este meio notificar que sua conta da <b style="color: rgb(38, 38, 173);">INTELIZE PAGAMENTOS</b> foi bloqueada.</p>
            <p>
            Entre em contacto com administrador, caso precise de alguns exclareciemento
            </p>
            <p>
            Obrigado, equipe da <b>INTELIZE INVESTIMENTOS</b>
            </p>`,
      headers: { "x-myheader": "test header" }
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.desbloququeioDeContaADM = async (empresa, email) => {
  try {
    await transportador.sendMail({
      from: `"${smtpConfig.nome}" <${smtpConfig.usuario}>`,
      to: email,
      subject: "Bloqueio de perfil - INTELIZE INVESTIMENTOS",
      // text: `Caro(a) cliente para redifinição de sua senha deverá introduzir o codigo de segurança: ${codigo_seguranca}`,
      html: `<p>Olá <b>${empresa}</b>,<br/>
            Viemos por este meio notificar que sua conta da <b style="color: rgb(38, 38, 173);">INTELIZE PAGAMENTOS</b> foi desbloqueada.</p>
            <p>
            Desfrute dos nossos serviços da melhor forma.
            </p>
            <p>
            Obrigado, equipe da <b>INTELIZE INVESTIMENTOS</b>
            </p>`,
      headers: { "x-myheader": "test header" }
    });
  } catch (error) {
    console.error(error.message);
  }
};

