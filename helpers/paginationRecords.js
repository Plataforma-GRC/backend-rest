const pagetion = require("../constants/pagetion")
module.exports = function(registro, page = pagetion.page, limit = pagetion.limit){

    const numero_registros = registro.length;
    const registroPorpage =  +limit || 100
    let  page_actual = +page || 1
    let total_pages = Math.ceil(numero_registros/registroPorpage); 
    
    if(page_actual == "0") page_actual = pagetion.page;
    if(registroPorpage == "0") registroPorpage = pagetion.limit;
    
    let count = (page_actual * registroPorpage) - registroPorpage;

    return { registros: {pages: total_pages, page_actual: page_actual, total: numero_registros, limit:registroPorpage, count } }
}