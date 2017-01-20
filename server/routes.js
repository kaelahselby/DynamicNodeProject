var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home');
module.exports = function(app) {
    router.get('/', home.index);
    router.get('/loginform', home.loginform);
    //router.post('/', home.index);
    router.post('/loginSubmit', home.loginSubmit);
    router.get('/timer', home.timer);
    router.get('/about', home.about);
    router.get('/register', home.register);
    router.get('/timerInit', home.timerInit);
    router.post('/registerSubmit', home.registerSubmit);
    router.post('/registerInit', home.registerInit);
    app.use(router);

};
