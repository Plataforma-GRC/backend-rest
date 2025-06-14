const axios = require("axios");
const saveRequest = require("./saveRequest");
const saveRequestToken = require("./saveNewTokenPRIMAVERA");
const listConditionals = require("./listConditionals");
const https = require("https");
const qs = require("qs");

module.exports = async (id_evento, entidade_aceite, dados) => {

  const conditional = (await listConditionals(id_evento, entidade_aceite)) || [];

  let defaultData =  dados

  try {
    
    // let RequestWebhook = {
    //   count: 0,
    //   endpoint: [],
    //   data: "",
    //   codEntidade: ""
    // };

    if (conditional.length > 0) {
      for (let item of conditional) {

        if((item.tipo_endpoint == "PRIMAVERA") && ((id_evento > 7) && (id_evento < 11))){
          
          let cliente = ""

          if((cliente != "") || (cliente != null)) cliente = String(dados.clientePRIMAVERA).split("=")[1]

          const schemaNew = {
            "Valor": Number(dados.montante_da_operacao),
            "ReferenciaServico": dados.referencia_do_servico,
            "NumeroEntidade": dados.numero_entidade,
            "Cliente": cliente,
            "LogERG": dados.Identificacao_Log_EGR,
            "NumeroTransacao": dados.identificacao_Transacao_Local,
            "ContaBanco": item.conta_primavera,
            "Serie": item.serie_primavera,
            "TipoMovimento": item.tipo_movimento_primavera,
            "TipoDocumento": item.tipo_documento_primavera,
            "Company": item.company_primavera,
            "UserName": item.username_primavera,
            "Password": item.password_primavera,  
            "Cambio":item.cambio_primavera,
            "NumeroLogEmis": dados.numero_Log_EGR
          } 

            dados = schemaNew
            defaultData =  dados
        }

        const res = await axios.post(String(item.url).trim(), dados, {
          headers: { 
            "user-agent": "INTELIZE PAGAMENTOS", 
            "Authorization": item.bearer_token
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: item.verificar_ssl == "true" ? true : false
          })
        });

        const datas = res.data;
        console.log(res.statusText + " : " + res.status)

        if(datas?.Pendente == null){
          await saveRequest(item.id_endpoint, datas, defaultData, "NÃO", res.statusText + " : " + res.status);
          return
        }

        await saveRequest(item.id_endpoint, datas, defaultData, "SIM", res.statusText + " : " + res.status);
        // RequestWebhook.count++;
        // RequestWebhook.endpoint.push(String(item.url).trim()); 
        // RequestWebhook.data = dados;
        // RequestWebhook.codEntidade = entidade_aceite;
      }
    }

  } catch (error) {

    console.error("ERRO\! =>", error);
    console.error("ERRO! =>", error.response?.status);
    console.error("TEXTO! =>", error.response?.statusText);
    

    if (conditional.length > 0) {
      for (let item of conditional) {

        if((item.tipo_endpoint == "PRIMAVERA") && ((id_evento > 7) && (id_evento < 11))){

          const dadosToken = qs.stringify({
            'username': item.username_primavera,
            'password': item.password_primavera,
            'instance': item.instance_primavera,
            'grant_type': 'password',
            'company':  item.company_primavera,
            'sessionkey': "1"
            // 'line': item.line_primavera 
          })

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${item.host_primavera}token`,
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : dadosToken
          };

          defaultData =  dados
          
          if((error.response.status == 401) || (error.response.status == 403)){

            try {
              const responseR = await axios.request(config);
              await saveRequestToken(item.id_endpoint, "Bearer " + responseR.data.access_token);
                            
              const res = await axios.post(String(item.url).trim(), dados, {
                headers: { 
                  "user-agent": "INTELIZE PAGAMENTOS", 
                  "Authorization": "Bearer " + responseR.data.access_token
                },
                httpsAgent: new https.Agent({
                  rejectUnauthorized: item.verificar_ssl == "true" ? true : false
                })
              });
              const datas = res.data;
              console.log(datas)
    
              await saveRequest(item.id_endpoint, datas, defaultData, "SIM", res.statusText + " : " + res.status);
              // RequestWebhook.count++;
              // RequestWebhook.endpoint.push(String(item.url).trim()); 
              // RequestWebhook.data = dados;
              // RequestWebhook.codEntidade = entidade_aceite;
              
              
            } catch (errorResponse) {
              if((errorResponse.response.status == 400) || (errorResponse.response.status == 404) || (errorResponse.response.status >= 500)){
                await saveRequest(item.id_endpoint, errorResponse.message, defaultData, 'NÃO', errorResponse.response.statusText + " : " + errorResponse.response.status);
                return;
              }
            }
            
            
          }
            
        }else {

          await saveRequest(item.id_endpoint, error.message, defaultData, 'NÃO', error.response.statusText + " : " + error.response.status);
          return;

        }
        
      }
    }

  }
};
