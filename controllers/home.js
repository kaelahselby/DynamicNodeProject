var UserModel = require('../models/user'),
    passwordHash = require('password-hash');
module.exports = {
    index: function(req, res) {
      var id = req.session.userid;
	if(!req.session.userid){
           var viewModel = {warn: 0,uid:id,login:"login", users:[],signin:"Sign up"};
           UserModel.find({}, {}, { sort: { timestamp: -1 }},
	     function(err, users) {
	         if (err) { throw err; }
		    viewModel.users = users;});
	  viewModel.warn = 1;
          viewModel.login="login";
          res.render('index', viewModel);
       }else{
          res.redirect('timerInit');}
          
    },
     timerInit: function(req, res) {
	UserModel.findOne({ userid: { $regex: req.session.userid } },
        function(err, users) {
           if (err) { throw err; }
      		 var id = req.session.userid;
        	 var viewModel = {access:users.lastAccess, visits:users.visits, warn: 0,uid:id,login:"logout", users:[],signin:"Signed in as "};
        	res.render('timer', viewModel);});
    },
    registerInit: function(req, res) {
      var id = null;
        var viewModel = {un: req.body.userid, pw: req.body.password,uid:id,login:"login", warn:0, signin:"Sign up"};
        res.render('register', viewModel);
    },
    loginform: function(req, res){
      var id = null;
      if(!req.session.userid){
        var viewModel = {uid:id,login:"login", warn:0, signin:"Sign up"};
        res.render('loginform', viewModel);
        }else{
	req.session.userid = null;
        var viewModel = {uid:id,login:"login", warn:1, signin:"Sign up"};
        res.render('index', viewModel);}
    },
    loginSubmit: function(req, res) {
        var id = null;
        var pword = req.body.password;
        UserModel.findOne({ userid: { $regex: req.body.userid } },
	function(err, users) {
	   if (err) { throw err; }
		if (users) {
                      if(passwordHash.verify(pword, users.password)){
                        users.visits = users.visits +1;
			users.save(); 
			req.session.userid = req.body.userid;
                   	 id = req.session.userid;
			 var viewModel = {access: users.lastAccess, visits:users.visits,uid:id,login:"logout", warn:0,signin:"Signed in as "}
                    	 res.render('timer', viewModel);
			}else{
                         var viewModel = {un:req.body.userid, pw:pword, uid:id,login:"login", warn:1,signin:"Sign up"}
                         res.render('loginform', viewModel);
				}
        	} else {
		    var viewModel = {un:req.body.userid, pw:pword, uid:id,login:"login", warn:0, warn2:1,signin:"Sign up"}
                    res.render('loginform', viewModel);	
		}
         });
    },
    timer: function(req, res) {
       var id = req.session.userid;
       var viewModel = {access:"", visits:0,uid:id,login:"logout",signin:"Signed as "};
	if(!req.session.userid){res.redirect('loginform');}else{
       res.render('timer', viewModel);}
    },
    register: function(req, res) {
        if(!req.session.userid){
        var warning ="";
        var id = null;
        var viewModel = {uid:id,login:"login", warn:0,warn2:0,signin:"Sign up"};
        res.render('register', viewModel);}
    },
    registerSubmit: function(req, res) {
        var id = null;
        var name = req.body.userid;
	var pword = req.body.password;
	var pword2 = req.body.password2;
        if(name.length < 6 && pword.length < 6){
          var viewModel = {uid:id,login:"login", email: req.body.email, warning: "Username AND Password", un:"", pw:"", warn2:0, warn:0, warn3:0, warn4:1,signin:"Sign up"}
          res.render('register', viewModel);
	}else if(pword.length < 6){
          var viewModel = {uid:id,login:"login", email: req.body.email, warning: "Password ", un:name, pw:"", warn2:0, warn:0, warn3:0, warn4:1,signin:"Sign up"}
          res.render('register', viewModel);
        }else if(name.length < 6){
           var viewModel = {uid:id,login:"login", email: req.body.email, warning: "Username", un:"", pw:pword, warn2:0, warn:0, warn3:0, warn4:1,signin:"Sign up"}
          res.render('register', viewModel);
        }else{
        if(pword == pword2){
        UserModel.findOne({ userid: { $regex: req.body.userid } },
        function(err, users) {
           if (err) { throw err; }
                if (users) {
				var viewModel = {uid:id,login:"login", email: req.body.email, un:"", pw: pword, warn2:0, warn:1,signin:"Sign up"}
			 	res.render('register', viewModel);
                } else {
		    req.session.userid = req.body.userid;
		    id = req.body.userid;
                    var hashedPassword = passwordHash.generate(pword);
                    var a = new UserModel({userid:req.body.userid,password:hashedPassword, email:req.body.email, visits:1});
                     a.save(function(err) {
                        if (err)
                                console.log(err);
                         });
                    var viewModel = {access: a.lastAccess, visits:1,uid:id,login:"logout", warn:0,signin:"Signed in as "}
                    res.render('timer', viewModel);
                }
         });}else{
		   var viewModel = {uid:id,login:"login", email: req.body.email, un:req.body.userid, pw:"", warn2:0, warn:0, warn3:1, signin:"Sign up"}
                                res.render('register', viewModel);
		}
	}
    },
    about: function(req, res) {
      var id = req.session.userid;
      if(!req.session.userid){
	var viewModel = {uid:id,login:"login", signin:"Sign up"};
        res.render('about', viewModel);
        }else{
	var viewModel = {uid:id,login:"logout", signin:"Signed in as "};
	res.render('about', viewModel);
      }
    }
};
