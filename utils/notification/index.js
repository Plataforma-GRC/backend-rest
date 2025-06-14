const channelWhatsapp = require("./sendWithWhatsapp");
const channelEmail = require("./sensdWithEmail");

module.exports = async () => {
  return {
    whatsapp: {
      codidoSeguranca: channelWhatsapp.codigoSeguranca
    },
    email: {
      codidoSeguranca: channelEmail.codigoSeguranca,
      bloququeioDeConta: channelEmail.bloququeioDeConta,
      comunicarEmail: channelEmail.comunicarEmail,
      bloququeioDeContaADM: channelEmail.bloququeioDeContaADM,
      desbloququeioDeContaADM: channelEmail.desbloququeioDeContaADM,
    },
    sms: {}
  };
};
