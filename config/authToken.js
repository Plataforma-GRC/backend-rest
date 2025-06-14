const jwt = require('jsonwebtoken');
const path = require('path');
const response = require("../constants/response"); 
require("dotenv").config({ path: path.resolve(path.join(__dirname,'../','.env')) });


exports.validateToken = (req,res,next)=>{

    const headerToken = (req.headers['authorization']) ? req.headers['authorization'] : 'No Authorizated';
    
    if(headerToken !== 'No Authorizated'){
        const token = headerToken && headerToken.split(' ')[1]

        if(headerToken.split(' ')[0] !== "Bearer"){
            const rs = response("erro", 403, "Utiliza a autorização Berear token correctamente");
            res.status(rs.statusCode).json(rs)
            return rs
            }

        jwt.verify(token, process.env.SECRETE_KEY_FOR_TOKEN,{algorithm:'HS512'}, async (err,jtoken)=>{ 
            if (err) {
                const rs = response("erro", 403, "Não autorizado. Token invalido");
                res.status(rs.statusCode).json(rs)
                return rs
            }else{
                req.token = jtoken
                if(jtoken.app?.dono == process.env.KEY_FOR_TOKEN)
                    next() 
                else{
                    const rs = response("erro", 403, "Não autorizado. Propriedade invalida");
                    res.status(rs.statusCode).json(rs)
                    return rs 
                }
            }     
        })
    }else{
        const rs = response("erro", 401, "Não autenticado. Token inexistente");
        res.status(rs.statusCode).json(rs)
        return rs
    }
    // 945041266 
}

exports.generateToken = (dados) => {
    const token = jwt.sign(JSON.stringify(dados),process.env.SECRETE_KEY_FOR_TOKEN,
    {
        algorithm:'HS512',
        // issuer:"INTELIZE INVESTIMENTOS - PORTAL DE PAGAMENTOS POR SECTOR",
        // audience:'CLIENTES INTELIZE',
        // subject:'AUTORIZAÇÃO DE RECURSOS DA API PARA O PORTAL DE PAGAMENTOS POR SECTOR',
        // expiresIn:'1000000d',
        
        
    }) 

    const rs = response("erro", 201, token);
    res.status(rs.statusCode).json(rs)
    return rs
}

