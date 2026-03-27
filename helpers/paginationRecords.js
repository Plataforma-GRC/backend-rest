const pagination = require("../constants/pagination")
module.exports = function(registro, page = pagination.page, limit = pagination.limit){

    const numero_records = registro.length;
    const registroPorpage =  +limit || 100
    let  page_actual = +page || 1
    let total_pages = Math.ceil(numero_records/registroPorpage); 
    
    if(page_actual == "0") page_actual = pagination.page;
    if(registroPorpage == "0") registroPorpage = pagination.limit;
    
    let count = (page_actual * registroPorpage) - registroPorpage;

    return { records: {pages: total_pages, page_actual: page_actual, total: numero_records, limit:registroPorpage, count } }
}