module.exports.cliente = {
  whatsapp: ""
};

module.exports.codigoSeguranca = async (
  contacto,
  numero_entidade,
  email,
  codigo_seguranca
) => {
  try {
    await this.cliente.whatsapp.sendText(
      `${contacto}@c.us`,
      `Entidade: *${numero_entidade}*\nEmail: *${email}*\n\nEnviamos o seguinte codigo de segurança para redifinição se sua sua: *${codigo_seguranca}*\nCodigo válido por apenas 10 minutos\n\n
          _*INTELIZE INVESTIMENTOS*_`
    );
  } catch (error) {
    console.error(error.message);
  }
};
