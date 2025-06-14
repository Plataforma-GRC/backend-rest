const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
const mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

module.exports = async function StrengthChecker(PasswordParameter) {
    try {
        if(strongPassword.test(PasswordParameter)) {
            return {bg:"success", texto:"Senha forte"}
        } else if(mediumPassword.test(PasswordParameter)) {
            return {bg:"warning", texto:"Senha rasoável"}
        } else {
            return {bg:"error", texto:"Senha fraca"}
        }
    
    }catch(e) {
        console.log(e.message)
    }
}