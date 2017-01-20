module.exports = {
    index: function(req, res) {
      var id = req.session.userid;
    var viewModel = {uid:id
    ,city:"oxford"};
      
      if(!req.session.userid){
        res.render('loginform', viewModel);
      }else{
        res.render('index', viewModel);
        
      }

    },
    loginform: function(req, res) {
      var id = req.body.userid;
      req.session.userid = id;
        var viewModel = {uid:id
    ,city:"oxford"};
        res.send(req.session.userid);
        res.redirect('/');
    }
};
