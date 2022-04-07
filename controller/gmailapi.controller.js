const gmailApiClass = require('../v1');

exports.token =(req,res) =>{
    gmailApiClass.getAcceToken().then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    })
}