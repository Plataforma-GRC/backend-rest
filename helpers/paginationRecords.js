const pagination = require("../constants/pagination")
module.exports = function(registro, pagina = pagination.pagina, limite = pagination.limite){

    const numero_registros = registro.length;
    const registroPorPagina =  +limite || 100
    let  pagina_actual = +pagina || 1
    let total_paginas = Math.ceil(numero_registros/registroPorPagina); 
    
    if(pagina_actual == "0") pagina_actual = pagination.pagina;
    if(registroPorPagina == "0") registroPorPagina = pagination.limite;
    
    let count = (pagina_actual * registroPorPagina) - registroPorPagina;

    return { registros: {paginas: total_paginas, pagina_actual: pagina_actual, total: numero_registros, limite:registroPorPagina, count } }
}