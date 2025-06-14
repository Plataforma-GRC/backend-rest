module.exports = async function(somatorioMensaisTabela, anoCorrenteTabela, mes, filteredCliente, filteredPagamentos){

    for (const iterator of filteredCliente) {
          

        let somaTotal = 0;
        let quantidade = 0;
        let montante = 0;
        let forma_de_uso = ''
        let percentual = ''
        let valor_fixo = 0

        if(!filteredPagamentos.length) continue 

        for (const i of filteredPagamentos) {
          
          if((iterator.forma_de_uso == "Percentual")){
            somaTotal += i.valor_total
            quantidade++
            montante += Number(i.montante_da_operacao)
            forma_de_uso = iterator.forma_de_uso
            percentual = iterator.percentual
            valor_fixo = iterator.valor_fixo
          }
          
          if((iterator.forma_de_uso == "Valor Fixo")){
              somaTotal += i.valor_total
              quantidade++
              montante += Number(i.montante_da_operacao)
              forma_de_uso = iterator.forma_de_uso
              percentual = iterator.percentual
              valor_fixo = iterator.valor_fixo
          }
            
        }
        

        iterator.registo = {
          somaTotal,
          quantidade,
          mensal: `${anoCorrenteTabela}-${mes}`,
          montante,
          forma_de_uso,
          percentual,
          valor_fixo
        };

        somatorioMensaisTabela.push({...iterator.registo});
      }
}
