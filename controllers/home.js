var UserModel = require('../models/user'),
    Timer = require('../models/timer'),
    passwordHash = require('password-hash');
//sayHello = function(string toWho) { return "hello " + toWho; }
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
          res.redirect('timer');}
          
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
                    	 res.redirect('timer');
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
    	
	function toMinuteAndSecond( x ) {
  	  	var hour = Math.floor(x/3600);
    		var minute = Math.floor((x-(hour*3600))/60);
   	 	var second = (x - (hour*3600) -(minute *60));
   	 	return{h:hour, m:minute, s:second};
  	}
        
     if(!req.session.userid){res.redirect('loginform');}else{
       var id = req.session.userid;
       var timer1 = {name: "", hour: "0", minute: "00", second: "00", start: "Start"}, 
           timer2= {name: "", hour: "0", minute: "00", second: "00", start: "Start"},
           timer3 = {name: "", hour: "0", minute: "00", second: "00", start: "Start"};
       UserModel.findOne({ userid: { $regex: id } },
        function(err, users) {
           if (err) { throw err; }
       //var viewModel = {times: u_timers, access:ac, visits:vis,uid:id,login:"logout",signin:"Signed as "};
	Timer.find({userid:{ $regex: id}},
             function(err, timer) { console.log(id + " has " + timer.length + "timers!");
                 if (err) { throw err; }
		        if(timer.length > 0){
                             timer1.name = timer[0].timerid;
                             timer1.hour = timer[0].hour;
			     timer1.minute = timer[0].minute;
                             timer1.second = timer[0].second;
                             if(timer[0].start){timer1.start = "Stop"}
                           var total1 = (timer1.hour*3600) + (timer1.minute*60) + timer1.second;
                           (function countdown() {
        			var updated = toMinuteAndSecond(total1);
        			timer[0].hour = updated.h;
        			timer[0].minute = updated.m;
       				timer[0].second = updated.s;
       				timer[0].save(function(err) {
                       			 if (err)
                               			 console.log(err);
                        		 });    
   				    (total1 -= 1) >= 0 && setTimeout(arguments.callee, 1000);
//					 var viewModel = {time1: timer1, time2: timer2, time3: timer3, access:users.lastAccess, visits:users.visits,uid:id,login:"logout",signin:"Signed as "};
  //                                      res.render('timer', viewModel);
    				})();
			    if(timer.length > 1){
                             timer2.name = timer[1].timerid;
                             timer2.hour = timer[1].hour;
                             timer2.minute = timer[1].minute;
                             timer2.second = timer[1].second;
			     if(timer[1].start){timer2.start = "Stop"}
                            var total2 = (timer2.hour*3600) + (timer2.minute*60) + timer2.second;
                           (function countdown() {
                                var updated = toMinuteAndSecond(total2);
                                timer[1].hour = updated.h;
                                timer[1].minute = updated.m;
                                timer[1].second = updated.s;
                                timer[1].save(function(err) {
                                         if (err)
                                                 console.log(err);
                                         });
                                    (total2 -= 1) >= 0 && setTimeout(arguments.callee, 1000);
//					 var viewModel = {time1: timer1, time2: timer2, time3: timer3, access:users.lastAccess, visits:users.visits,uid:id,login:"logout",signin:"Signed as "};
  //                                      res.render('timer', viewModel);
                                })();
			     if(timer.length > 0){
                             timer3.name = timer[2].timerid;
                             timer3.hour = timer[2].hour;
                             timer3.minute = timer[2].minute;
                             timer3.second = timer[2].second;
                             if(timer[2].start){timer3.start = "Stop"}
   				var total3 = (timer3.hour*3600) + (timer3.minute*60) + timer3.second;
				 (function countdown() {
                                var updated = toMinuteAndSecond(total3);
                                timer[2].hour = updated.h;
                                timer[2].minute = updated.m;
                                timer[2].second = updated.s;
                                timer[2].save(function(err) {
                                         if (err)
                                                 console.log(err);
                                         });
                                    (total3 -= 1) >= 0 && setTimeout(arguments.callee, 1000);
    //                                var viewModel = {time1: timer1, time2: timer2, time3: timer3, access:users.lastAccess, visits:users.visits,uid:id,login:"logout",signin:"Signed as "};
      // 					res.render('timer', viewModel);
                                })();
				}}}
                        });
       
       var viewModel = {time1: timer1, time2: timer2, time3: timer3, access:users.lastAccess, visits:users.visits,uid:id,login:"logout",signin:"Signed as "};
       res.render('timer', viewModel);
       });
   } },
    timerSubmit: function(req, res) {
       var id = req.session.userid;
       var m = req.body.minute;
       var h = req.body.hour;
       var s = req.body.second;
       var name = req.body.timerName;
       //var timer1 = [0, 00, 00], timer2= [0, 00, 00], timer3 = [0, 00, 00];
        Timer.findOne({ timerid: { $regex:name } },
        function(err, timer) {
           if (err) { throw err; }
                if (timer) {
                timer.start = 0;
                timer.save(function(err) {
                        //console.log("timer Created");
                        if (err)
                                console.log(err);
                         });
            }else{
                 var a = new Timer({userid: req.session.userid, timerid:name,hour:h, minute:m, second:s, start:1});
                     a.save(function(err) {
                        console.log("timer Created");
                        if (err)
                                console.log(err);
                         });
             }});
       var viewModel = {access:"", visits:0,uid:id,login:"logout",signin:"Signed as "};
       res.redirect('timer');
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
