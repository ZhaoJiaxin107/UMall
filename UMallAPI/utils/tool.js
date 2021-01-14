const jwt = require('jsonwebtoken');
let secret = 'zjxzjx624553259'
function getMsg(msg, status, data){
    if(status == 200){
        return { msg, status, data }
    }else{
        return { msg, status}
    }
    
}

function setToken(user){
    return jwt.sign(
        user,
        secret,
        {
            expiresIn: 60 // seconds
        }
    )
}

function getToken(token){
    try{
        return jwt.verify(token, secret)
    }catch(err){
        console.log('Token expired or no token')
        return false
    }
}
exports.getMsg = getMsg;
exports.setToken = setToken;
exports.getToken = getToken;
