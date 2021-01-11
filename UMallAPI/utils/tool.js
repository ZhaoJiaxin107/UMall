function getMsg(msg, status, data){
    if(status == 200){
        return { msg, status, data }
    }else{
        return { msg, status}
    }
    
}

exports.getMsg = getMsg;