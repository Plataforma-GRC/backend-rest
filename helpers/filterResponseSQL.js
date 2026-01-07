const { da } = require("date-fns/locale")

module.exports.pagamentosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

          
        delete rf.id_ultimo_ficheiro
        delete rf.id_produto
        delete rf.codigo_produto
        delete rf.operacao_Pagamento
        delete rf.codigo_de_Resposta_da_Empresa
        delete rf.ficheiro_fsec_processado
        delete rf.MFT
        delete rf.PRT
        delete rf.aplicaccao_PDD
        delete rf.codigo_parametro
        delete rf.configurado_sector
        delete rf.RFU
        delete rf.criada_r
        delete rf.actualiza_em
        delete rf.data_limite_pagamento
        delete rf.estado_atm
        delete rf.usabilidade
        delete rf.tipo_referencia_pagamento
        delete rf.montantes_fixo
        delete rf.campo_codigo_cliente_primavera
        delete rf.gerado_por_afiliado
        delete rf.aceitar_fixo
        delete rf.estado_pagamento
        delete rf.verificacao_por_cinco_vezes
        delete rf.indicador_de_produtos
        delete rf.tipo_de_registro
        delete rf.referencia_do_montante
        delete rf.codigo_de_processamento
        delete rf.textos_para_talao
        delete rf.codigo_de_ativacao
        delete rf.numero_serie_helpDesk
        delete rf.chave_ativacao
        delete rf.data_de_validade
        delete rf.montante_minimo
        delete rf.montante_maximo
        delete rf.data_inicio_de_pagamento
        delete rf.codigo_de_cliente
        delete rf.numero_de_linhas
        delete rf.indicador_produto_id
        delete rf.ficheiro_fref_processado
        delete rf.cliente_tipo_produto
        delete rf.criado_quando
        delete rf.codigo_do_produto
        delete rf.id_tipo_produto
        delete rf.registo_produto
        delete rf.id_referencia
        delete rf.entidade_cliente
        delete rf.num_referencia
        delete rf.quantidade_de_unidades
        delete rf.timestamp_PRT_chegada
        delete rf.timestamp_PRT_saida
  
        rf.tipo_de_Terminal = rf.tipo_de_Terminal == "A" ? "ATM" : rf.tipo_de_Terminal == "M" ? "MULTICAIXA EXPRESS" : rf.tipo_de_Terminal == "I" ? "INTERNET BANK" : "INTERNET BANK"
  
    return rf
      })
}

module.exports.periodosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

          
        delete rf.id_ultimo_ficheiro
        delete rf.id_produto
        delete rf.codigo_produto
        delete rf.operacao_Pagamento
        delete rf.codigo_de_Resposta_da_Empresa
        delete rf.ficheiro_fsec_processado
        delete rf.MFT
        delete rf.PRT
        delete rf.aplicaccao_PDD
        delete rf.codigo_parametro
        delete rf.RFU
        delete rf.notificacao_PRT
        delete rf.pagamento_MFT
        delete rf.criada_r
        delete rf.actualiza_em
        delete rf.data_limite_pagamento
        delete rf.estado_atm
        delete rf.usabilidade
        delete rf.tipo_referencia_pagamento
        delete rf.montantes_fixo
        delete rf.campo_codigo_cliente_primavera
        delete rf.gerado_por_afiliado
        delete rf.aceitar_fixo
        delete rf.estado_pagamento
        delete rf.verificacao_por_cinco_vezes
        delete rf.indicador_de_produtos
        delete rf.tipo_de_registro
        delete rf.referencia_do_montante
        delete rf.codigo_de_processamento
        delete rf.textos_para_talao
        delete rf.codigo_de_ativacao
        delete rf.numero_serie_helpDesk
        delete rf.chave_ativacao
        delete rf.data_de_validade
        delete rf.montante_minimo
        delete rf.montante_maximo
        delete rf.data_inicio_de_pagamento
        delete rf.codigo_de_cliente
        delete rf.numero_de_linhas
        delete rf.indicador_produto_id
        delete rf.ficheiro_fref_processado
        delete rf.cliente_tipo_produto
        delete rf.criado_quando
        delete rf.codigo_do_produto
        delete rf.id_tipo_produto
        delete rf.registo_produto
        delete rf.id_referencia
        delete rf.entidade_cliente
        delete rf.num_referencia
        delete rf.quantidade_de_unidades
        delete rf.timestamp_PRT_chegada
        delete rf.timestamp_PRT_saida
        delete rf.tipo_de_Terminal
  
    return rf
      })
}

module.exports.referenciasFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        if(rf.tipo_referencia_pagamento == "L"){
            delete rf.tipo_referencia_pagamento
            delete rf.registo_produto
            delete rf.id_produto
            delete rf.cliente_tipo_produto
            delete rf.codigo_do_produto
            delete rf.ficheiro_fref_processado
            delete rf.ficheiro_fsec_processado
            delete rf.indicador_produto_id
            delete rf.numero_de_linhas
            delete rf.codigo_de_cliente
            delete rf.criado_quando
            delete rf.data_inicio_de_pagamento
            delete rf.montante_maximo
            delete rf.montante_minimo
            delete rf.data_de_validade
            delete rf.chave_ativacao
            delete rf.numero_serie_helpDesk
            delete rf.codigo_de_ativacao
            delete rf.quantidade_de_unidades
            delete rf.textos_para_talao
            delete rf.codigo_de_processamento
            delete rf.referencia_do_montante
            delete rf.tipo_de_registro
            delete rf.indicador_de_produtos
            delete rf.gerado_por_afiliado
            
            delete rf.id_tipo_produto
        }     
        
        if(rf.tipo_referencia_pagamento == "P"){
          delete rf.tipo_referencia_pagamento
          delete rf.registo_produto
          delete rf.id_produto
          delete rf.cliente_tipo_produto
          delete rf.codigo_do_produto
          delete rf.criado_quando
          delete rf.ficheiro_fref_processado
          delete rf.ficheiro_fsec_processado
          delete rf.indicador_produto_id
          delete rf.numero_de_linhas
          delete rf.codigo_de_cliente
          delete rf.data_inicio_de_pagamento
          delete rf.montante_maximo
          delete rf.montante_minimo
          delete rf.data_de_validade
          delete rf.chave_ativacao
          delete rf.numero_serie_helpDesk
          delete rf.codigo_de_ativacao
          delete rf.quantidade_de_unidades
          delete rf.textos_para_talao
          delete rf.codigo_de_processamento
          delete rf.referencia_do_montante
          delete rf.tipo_de_registro
          delete rf.indicador_de_produtos
          delete rf.gerado_por_afiliado
          
          delete rf.id_tipo_produto
          delete rf.montantes_fixo
        } 

        if(rf.tipo_referencia_pagamento == "I"){
          delete rf.tipo_referencia_pagamento
          delete rf.registo_produto
          delete rf.id_produto
          delete rf.cliente_tipo_produto
          delete rf.codigo_do_produto
          delete rf.ficheiro_fref_processado
          delete rf.ficheiro_fsec_processado
          delete rf.indicador_produto_id
          delete rf.data_de_validade
          delete rf.chave_ativacao
          delete rf.numero_serie_helpDesk
          delete rf.codigo_de_ativacao
          delete rf.quantidade_de_unidades
          delete rf.codigo_de_processamento
          delete rf.referencia_do_montante
          delete rf.tipo_de_registro
          delete rf.indicador_de_produtos
          delete rf.gerado_por_afiliado
          
          delete rf.id_tipo_produto
          delete rf.montantes_fixo
          delete rf.criado_quando
        }

        return rf
       })
}

module.exports.perfilFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso
        delete rf.entidade_especifica

        delete rf.id_conf         
        delete rf.cliente_entidade         
        delete rf.tentativas_login         
        delete rf.codigo_seguranca         
        delete rf.tempo_de_vida_codigo_seguranca         
        delete rf.ip_primario         
        delete rf.ip_secundario         
        delete rf.servico_whatsapp         
        delete rf.habilitar_area_docs         
        delete rf.habilitar_area_tecnica         
        delete rf.habilitar_area_coluna_prt_tabela_pagamentos         
        delete rf.habilitar_area_coluna_mft_tabela_pagamentos         
        delete rf.habilitar_area_coluna_concliacao_tabela_pagamentos        
        

        return rf
       })
}

module.exports.clientesFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.nome_empresa
        delete rf.numero_entidade
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        

        return rf
       })
}

module.exports.clientesTransacoesFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.numero_entidade
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        

        return rf
       })
}

module.exports.clientesTransacoesSomatorioFilteres = function(transaccoes = [], clientes = []){

      const resultSet = clientes.reduce((prev, curr) => {

            const maped = transaccoes.filter(val => val.entidade == curr.numero_entidade )
            .reduce((pv, cr)=>{

                if((curr.forma_de_uso == "Percentual")){
                    pv.somaTotal += cr.valor_total
                    pv.quantidade++
                    pv.montante += Number(cr.montante_da_transaccao)
                    pv.valor_fixo = curr.valor_fixo
                }

                if((curr.forma_de_uso == "Valor Fixo")){
                    pv.somaTotal += cr.valor_total
                    pv.quantidade++
                    pv.montante += Number(cr.montante_da_transaccao)
                    pv.valor_fixo = curr.valor_fixo
                }
                
                return pv

            }, {
                somaTotal : 0,
                quantidade : 0,
                montante : 0,
                valor_fixo : 0
            })
          
            curr.info  = maped
            const modified =  curr
            prev.push(modified)
            return prev
      },[])

    return resultSet.filter(rf => {

        delete rf.entidade_master
        delete rf.responsavel
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        

        return rf
       })
}

module.exports.clientesTruesFilteres = function(resultSet = []){

    return resultSet.filter(rf => {


        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.habilitar_area_docs
        delete rf.habilitar_area_tecnica
        delete rf.habilitar_area_coluna_prt_tabela_pagamentos
        delete rf.habilitar_area_coluna_mft_tabela_pagamentos
        delete rf.habilitar_area_coluna_concliacao_tabela_pagamentos
        delete rf.servico_whatsapp
        delete rf.servico_email
        delete rf.servico_mensagens
        delete rf.servico_gpo
        delete rf.servico_pagamento_por_sector
        delete rf.pagamento_tempo_real
        delete rf.aceitar_webhook
        delete rf.ip_secundario
        delete rf.ip_primario
        delete rf.tempo_de_vida_codigo_seguranca
        delete rf.codigo_seguranca
        delete rf.tentativas_login
        delete rf.cliente_entidade
        delete rf.id_conf
        delete rf.senha_
        delete rf.cadastrado_em
        delete rf.tipo_usuario
        delete rf.gerado_por
        delete rf.senha     
        

        return rf

       })
}

module.exports.clientesFrameworksFilteres = function(resultAll = [], resultSet = []){

    const final = []
    for(const rf of resultAll) {

        const dados = {...rf, frameworks:[]}

        
        for (const dt of resultSet){
            
            delete dt.id_clientes
            delete dt.nome_empresa  
            delete dt.nif
            delete dt.contacto
            delete dt.contacto_2
            delete dt.email
            delete dt.email_2
            delete dt.logo
            delete dt.bloqueio
            delete dt.ultimo_login
            delete dt.ultimo_logout
            delete dt.hash_autenticador
            delete dt.sector_atuacao
            delete dt.tamanho_organizacao
            delete dt.cliente_time
            delete dt.cliente_update
            delete dt.framework_time
            delete dt.framework_update
            delete dt.novo_cliente
            delete dt.tipo_usuario
            delete dt.senha
            delete dt.frameworks_id_fk
            delete dt.clientes_frameworks_time
            delete dt.clientes_frameworks_update
            delete dt.framework_tipo_id_fk
            delete dt.framework_orgao_id_fk
            delete dt.clientes_frameworks_id
            delete dt.cliente_industria_id
            delete dt.cliente_jurisdicao_id
            
            
            if(dados?.id_clientes == dt?.clientes_id_fk){
                delete dt.clientes_id_fk
                dados.frameworks.push(dt)
            }
            
        }

        final.push(dados)
        
    }

    return final
}

module.exports.clientesFrameworksIdFilteres = function(resultAll = [], resultSet = []){

        const dados = {...resultAll, frameworks:[]}

        
        for (const dt of resultSet){
            
            delete dt.id_clientes
            delete dt.nome_empresa  
            delete dt.nif
            delete dt.contacto
            delete dt.contacto_2
            delete dt.email
            delete dt.email_2
            delete dt.logo
            delete dt.bloqueio
            delete dt.ultimo_login
            delete dt.ultimo_logout
            delete dt.hash_autenticador
            delete dt.sector_atuacao
            delete dt.tamanho_organizacao
            delete dt.cliente_time
            delete dt.cliente_update
            delete dt.framework_time
            delete dt.framework_update
            delete dt.novo_cliente
            delete dt.tipo_usuario
            delete dt.senha
            delete dt.frameworks_id_fk
            delete dt.clientes_frameworks_time
            delete dt.clientes_frameworks_update
            delete dt.framework_tipo_id_fk
            delete dt.framework_orgao_id_fk
            delete dt.clientes_frameworks_id
            delete dt.cliente_industria_id
            delete dt.cliente_jurisdicao_id
            
            
            if(dados?.id_clientes == dt?.clientes_id_fk){
                delete dt.clientes_id_fk
                dados.frameworks.push(dt)
            }
            
        }
        

    return dados
}

module.exports.JurisdicaoComFrameworksTruesFilteres = function(resultAll = [], resultSet = []){


    const final = []
    for(const rf of resultAll) {

        const dados = {...rf, frameworks:[]}

        
        for (const dt of resultSet){
            
            delete dt.jurisdicao_activa_id
            delete dt.jurisdicao_activa_time
            delete dt.jurisdicao_activa_update
            delete dt.jurisdicao_activa_id
            delete dt.jurisdicao_activa_id
            delete dt.framework_id_fk
            delete dt.framework_jurisdicao_time
            delete dt.framework_jurisdicao_update
            delete dt.framework_tipo_id
            delete dt.framework_orgao_id
            delete dt.tipo_usuario
            delete dt.framework_time
            delete dt.framework_update

            
            if(dados?.jurisdicao_activa_id == dt?.jurisdicao_activa_id_fk){
                delete dt.jurisdicao_activa_id_fk
                dados.frameworks.push(dt)
            }
            
        }

        final.push(dados)
        
    }

    return final
    
}

module.exports.escalasMatrizFilteres = function(resultAll = [], resultSet = []){


    const final = []
    for(const rf of resultAll) {

        const dados = {...rf, classifacoes:[]}

        
        for (const dt of resultSet){
            
            delete dt.jurisdicao_activa_id
            delete dt.jurisdicao_activa_time
            delete dt.jurisdicao_activa_update
            delete dt.jurisdicao_activa_id
            delete dt.jurisdicao_activa_id
            delete dt.framework_id_fk
            delete dt.framework_jurisdicao_time
            delete dt.framework_jurisdicao_update
            delete dt.framework_tipo_id
            delete dt.framework_orgao_id
            delete dt.tipo_usuario
            delete dt.framework_time
            delete dt.framework_update

            
            if(dados?.risco_escala_id == dt?.risco_escala_id_cls_fk){
                delete dt.risco_escala_id_cls_fk
                dados.classifacoes.push(dt)
            }
            
        }

        final.push(dados)
        
    }

    return final
    
}

module.exports.riscosTruesFilteres = function(resultSet = []){

    return resultSet.filter(rf => {


        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.habilitar_area_docs
        delete rf.habilitar_area_tecnica
        delete rf.habilitar_area_coluna_prt_tabela_pagamentos
        delete rf.habilitar_area_coluna_mft_tabela_pagamentos
        delete rf.habilitar_area_coluna_concliacao_tabela_pagamentos
        delete rf.servico_whatsapp
        delete rf.servico_email
        delete rf.servico_mensagens
        delete rf.servico_gpo
        delete rf.servico_pagamento_por_sector
        delete rf.pagamento_tempo_real
        delete rf.aceitar_webhook
        delete rf.ip_secundario
        delete rf.ip_primario
        delete rf.tempo_de_vida_codigo_seguranca
        delete rf.codigo_seguranca
        delete rf.tentativas_login
        delete rf.cliente_entidade
        delete rf.id_conf
        delete rf.senha_
        delete rf.cadastrado_em
        delete rf.tipo_usuario
        delete rf.gerado_por
        delete rf.senha     
        

        return rf

       })
}

module.exports.usuariosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.senha_     
        

        return rf
       })
}

module.exports.relatoriosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.nome_empresa
        delete rf.numero_entidade
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        delete rf.configurado_sector        
        

        return rf
       })
}

module.exports.produtosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.cliente_tipo_produto
        delete rf.criado_quando
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.id_tipo_produto_clientes
        delete rf.cliente
        delete rf.id_tipo_produto
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.configurado_sector
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        

        return rf
       })
}

module.exports.tipoProdutosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.cliente_tipo_produto
        delete rf.criado_quando
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.id_tipo_produto_clientes
        delete rf.cliente
        delete rf.id_tipo_produto
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.configurado_sector
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        delete rf.feito_em        
        delete rf.montantes_fixo        
        delete rf.codigo_do_produto        
        delete rf.nome_empresa        
        delete rf.tipo_registo        
        delete rf.id_produto        
        delete rf.produto        
        

        return rf
       })
}

module.exports.produtosClientesFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.id_tipo_produto_clientes
        delete rf.cliente
        delete rf.id_tipo_produto
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.configurado_sector
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        delete rf.feito_em             
        delete rf.nome_empresa        
        delete rf.tipo_registo       
        

        return rf
       })
}

module.exports.configuracoesFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.numero_entidade
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.nif
        delete rf.contacto
        delete rf.email
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.configurado_sector
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.gpo_numero_comerciante
        delete rf.gpo_numero_cartao
        delete rf.gpo_numero_banco
        delete rf.gpo_numero_POS
        delete rf.gpo_numero_establecimento
        delete rf.gpo_comerciante_hash
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        

        return rf
       })
}

module.exports.posFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.entidade_master
        delete rf.responsavel
        delete rf.nif
        delete rf.contacto
        delete rf.bloqueio
        delete rf.num_padrao_referencias
        delete rf.preenchimento_refs_zeros_a_esquerda
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato
        delete rf.parametrizado_como
        delete rf.validacao_referencias
        delete rf.ultimo_login
        delete rf.montante_maximo_pagamento
        delete rf.montante_minimo_pagamento
        delete rf.id_por_uso
        delete rf.entidade_especifica
        delete rf.tipo_cliente
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso        
        delete rf.minimo         
        delete rf.maximo        
        

        return rf
       })
}

module.exports.produtosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.senha;
        delete rf.tipo_produto;
        delete rf.tipo_registo;
        delete rf.nif;
        delete rf.contacto;
        delete rf.email;
        delete rf.criando_em;
        delete rf.feito_em;
        delete rf.logo;
        delete rf.bloqueio;
        delete rf.senha;
        delete rf.cliente;
        delete rf.tipo_registo;
        delete rf.id_clientes;
        delete rf.tipo_produto;
        delete rf.nif;
        delete rf.contacto;
        delete rf.email;
        delete rf.criando_em;
        delete rf.logo;
        delete rf.id_tipo_produto;
        delete rf.comunicacao;
        delete rf.num_padrao_referencias;
        delete rf.responsavel;
        delete rf.senha;
        delete rf.bloqueio;
        delete rf.entidade_master;
        delete rf.actualizado_em;
        delete rf.configurado_sector;
        delete rf.preenchimento_refs_zeros_a_esquerda;
        delete rf.ultimo_ficheiro_enviado_a_emis;
        delete rf.data_de_inicio_de_contrato;
        delete rf.data_de_fim_de_contrato;
        delete rf.arquivo_do_contrato;
        delete rf.novo_cliente;
        delete rf.parametrizado_como;
        delete rf.validacao_referencias;
        delete rf.ultimo_login;
        delete rf.endereco_mac_unico;
        delete rf.criado_por;
        delete rf.montante_maximo_pagamento;
        delete rf.montante_minimo_pagamento;
        delete rf.versao_mensagem_PRT;
        delete rf.caraterizacao_cliente;
        delete rf.percentagem_de_uso;
        delete rf.gpo_numero_comerciante;
        delete rf.gpo_numero_cartao;
        delete rf.gpo_numero_banco;
        delete rf.gpo_numero_POS;
        delete rf.gpo_numero_establecimento;
        delete rf.gpo_comerciante_hash;
        

        return rf
       })
}

module.exports.afiliadosFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso    
        delete rf.nif
        delete rf.contacto 
        delete rf.email
        delete rf.entidade_master 
        delete rf.num_padrao_referencias 
        delete rf.configurado_sector 
        delete rf.preenchimento_refs_zeros_a_esquerda 
        delete rf.responsavel 
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato 
        delete rf.bloqueio 
        delete rf.validacao_referencias 
        delete rf.ultimo_login 
        delete rf.montante_maximo_pagamento       
        delete rf.montante_minimo_pagamento       
        delete rf.gpo_numero_comerciante       
        delete rf.gpo_numero_cartao       
        delete rf.gpo_numero_banco       
        delete rf.gpo_numero_POS       
        delete rf.gpo_numero_establecimento       
        delete rf.gpo_comerciante_hash       
        delete rf.cliente_id       
        delete rf.grupo_identificacao       
        delete rf.id_identificacao_afiliados       
        delete rf.entidade_das_afiliadas       
        delete rf.gerado_ident_em       
        delete rf.parametrizado_como  
        delete rf.user_pass  
        

        return rf
       })
}

module.exports.credenciaisFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.numero_entidade 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.percentagem_de_uso    
        delete rf.nif
        delete rf.contacto 
        delete rf.email
        delete rf.entidade_master 
        delete rf.num_padrao_referencias 
        delete rf.preenchimento_refs_zeros_a_esquerda 
        delete rf.responsavel 
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato 
        delete rf.bloqueio 
        delete rf.validacao_referencias 
        delete rf.ultimo_login 
        delete rf.montante_maximo_pagamento       
        delete rf.montante_minimo_pagamento       
        delete rf.gpo_numero_comerciante       
        delete rf.gpo_numero_cartao       
        delete rf.gpo_numero_banco       
        delete rf.gpo_numero_POS       
        delete rf.gpo_numero_establecimento       
        delete rf.gpo_comerciante_hash       
        delete rf.cliente_id       
        delete rf.grupo_identificacao       
        delete rf.id_identificacao_afiliados       
        delete rf.entidade_das_afiliadas       
        delete rf.gerado_ident_em       
        delete rf.parametrizado_como  
        delete rf.user_pass  
        

        return rf
       })
}

module.exports.afiliadosIdentificacaoFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

        
        delete rf.id_clientes
        delete rf.senha
        delete rf.criando_em 
        delete rf.logo
        delete rf.comunicacao 
        delete rf.tipo_produto 
        delete rf.ultimo_ficheiro_enviado_a_emis 
        delete rf.actualizado_em 
        delete rf.arquivo_do_contrato 
        delete rf.novo_cliente
        delete rf.endereco_mac_unico 
        delete rf.criado_por 
        delete rf.versao_mensagem_PRT 
        delete rf.caraterizacao_cliente 
        delete rf.configurado_sector 
        delete rf.percentagem_de_uso    
        delete rf.nif
        delete rf.contacto 
        delete rf.email
        delete rf.entidade_master 
        delete rf.num_padrao_referencias 
        delete rf.preenchimento_refs_zeros_a_esquerda 
        delete rf.responsavel 
        delete rf.data_de_inicio_de_contrato
        delete rf.data_de_fim_de_contrato 
        delete rf.bloqueio 
        delete rf.validacao_referencias 
        delete rf.ultimo_login 
        delete rf.montante_maximo_pagamento       
        delete rf.montante_minimo_pagamento       
        delete rf.gpo_numero_comerciante       
        delete rf.gpo_numero_cartao       
        delete rf.gpo_numero_banco       
        delete rf.gpo_numero_POS       
        delete rf.gpo_numero_establecimento       
        delete rf.gpo_comerciante_hash      
        delete rf.parametrizado_como  
        delete rf.entidade_das_afiliadas  
        

        return rf
       })
}

module.exports.endpointsFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

          
        // delete rf.id_evento
        // delete rf.evento
        // delete rf.endpoint
        // delete rf.criacao_em
        // delete rf.validade_token
        // delete rf.bearer_token
        // delete rf.tipo_endpoint
        // delete rf.para_servico
        // delete rf.activo
        // delete rf.verificar_ssl
        // delete rf.gpo_eventos
  
        return rf
      })
}

module.exports.webhookFilteres = function(resultSet = []){

    return resultSet.filter(rf => {

          
        delete rf.id_evento
        delete rf.evento
        delete rf.id_endpoint
        delete rf.endpoint
        delete rf.criacao_em
        delete rf.validade_token
        delete rf.bearer_token
        delete rf.tipo_endpoint
        delete rf.para_servico
        delete rf.activo
        delete rf.verificar_ssl
        delete rf.gpo_eventos
  
        return rf
      })
}

module.exports.webhookTentativasFilteres = function(resultSet = []){

    const filter =  resultSet.filter(rf => {

          
        delete rf.id_evento
        delete rf.evento
        delete rf.id_endpoint
        delete rf.endpoint
        delete rf.criacao_em
        delete rf.validade_token
        delete rf.bearer_token
        delete rf.tipo_endpoint
        delete rf.para_servico
        delete rf.activo
        delete rf.verificar_ssl
        delete rf.requesicao
        delete rf.username_primavera
        delete rf.password_primavera
        delete rf.instance_primavera
        delete rf.grant_type_primavera
        delete rf.company_primavera
        delete rf.line_primavera
        delete rf.campo_codigo_cliente_primavera
        delete rf.gpo_eventos
        delete rf.conta_primavera
        delete rf.serie_primavera
        delete rf.tipo_documento_primavera
        delete rf.tipo_movimento_primavera
        delete rf.cambio_primavera
        delete rf.tipo_resposta
        delete rf.log
        delete rf.host_primavera
        delete rf.comerciante_gpo
  
        return rf
      })

    const reduced = filter.reduce(function (prev, curr){
        
        prev.retry_tentados.push({
            id_logs_tentativa: curr.id_logs_tentativa,
            status_tentativa: curr.status_tentativa,
            tempo_tentado: curr.tempo_tentado,
            status_http: curr.status_http,
            status_text_http: curr.status_text_http,
            response_http_body: curr.response_http_body
        })

        prev.id_logreq = curr.id_logreq
        prev.entidade = curr.entidade_aceite
        prev.data_evento = curr.data_evento
        prev.resposta = curr.resposta
        prev.enviado = curr.enviado
        prev.statusCode = curr.statusCode
        prev.tentativas = curr.tentativas
        prev.timestamp_log = curr.timestamp_log
        prev.proximoRetryEmSegundo = curr.proximoRetryEmSegundo
        prev.tempoPercorrido = curr.tempoPercorrido
        prev.url = curr.url
        

        return prev

    },{retry_tentados:[]})

      return reduced
}