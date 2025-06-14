const ejs =  require('ejs');
const pdf = require('html-pdf');
const path = require('path');


module.exports = async function(entidade, tipo, dados){


    const filename = new Date().toISOString().split('Z')[0].replaceAll('-','').replaceAll('T','').replaceAll(':','').replaceAll('.','')+'.pdf'

    ejs.renderFile(path.resolve(path.join(__dirname,'pdf.ejs')),dados,(erro, html) => {

        if(erro){
            console.log(erro)
            return {status: 'erro', mensagem:"Aconteceu algo erro! Tente novamente"}
        } 
        
        
        pdf.create(html,{
            format:'A4',
            orientation:'portrait',
            
        }).toFile(path.resolve(__dirname,'../../reports/',entidade, tipo ,path.join(filename)), (err, response) => {
            if(err){
                console.log(err)
                return {status: 'erro', mensagem:"Aconteceu algo erro! Tente novamente"}       
            } 
            
            console.log(response)
        });
            
            
    })
    
    return {status: 'sucesso', mensagem:'Gerado com sucesso'}
}
 