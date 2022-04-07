module.exports = (app) =>{
    const Gmail = require('../controller/gmailapi.controller');

    app.post('/getToken',Gmail.token)
}