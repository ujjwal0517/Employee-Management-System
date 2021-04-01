const express = require('express');
const User = require('../model/users');
const bcrypt = require('bcryptjs');

const router = express.Router();
const passport = require('passport');
const admin = require('../model/admin');
const Task = require('../model/task')
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth')
router.get('/', (req, res)=>{
    res.render("login")

})
router.post("/", forwardAuthenticated ,(req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
})
router.get('/register',forwardAuthenticated, (req, res)=>{
    res.render("register")
})
router.post('/register', (req, res)=>{
    const {name, email, password, password2} = req.body;
    let errors  = [];
    if(!name || !email || !password || !password2){
        errors.push({msg: 'please enter all fields'});
    }
    if(password != password2){
        errors.push({msg: 'passwords do not match'});

    }
    if(errors.length>0){
        res.render("register", {
            errors, 
            name, 
            email, 
            password, 
            password2
        });
    }else{
        User.findOne({email : email}).then(user=>{
            if(user){
            errors.push({msg: 'email already exists'});
            res.render('register', {
              errors, name, email, password, password2  
            });
            }else{
                const newUser = new User({
                    name, 
                    email, 
                    password
                });
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user=>{
                            req.flash('success_msg', 'you are now registered and can login')
                            res.redirect('/')    
                        })
                        .catch(err=>console.log(err))
                    })
                })
            }
        })
    }
})
router.get("/dashboard",ensureAuthenticated, async (req, res)=>{
res.render("dashboard");
});
  
    //logout
    router.get("/logout", (req,res)=>{
        req.logout();
        req.flash('success_msg', "Your are logged out");
        res.redirect('/');
    })
    router.get("/task",async(req, res)=>{
     const work =  await Task.find()
        res.render("task", {task: work})
    })
    router.get('/admin',forwardAuthenticated, (req, res)=>{
        res.render("adminlogin");
    })
    router.post('/admin', (req, res)=>{
        let errors  = [];
      if(admin[0].email === req.body.email && admin[0].password===req.body.password){
          res.render("admindashboard")
      }else if(admin[0].email!= req.body.email && admin[0].password!= req.body.password){
        errors.push({msg: 'Invalid Credentials'});
      }
    });
    router.get('/addtask', ensureAuthenticated, (req, res)=>{
        res.render("addtask");
    });
    router.post('/addtask', async (req, res)=>{
        
        const tasks = await new Task({
            task: req.body.task,
            assigned: req.body.name,
          });
          await tasks.save();

          const work = await Task.find()
          res.render("admintask", {task: work})
         
    })
   router.get("/deletetask/:id",ensureAuthenticated, async(req, res)=>{
        await Task.findById(req.params.id, (err, result)=>{
            if(err){
                console.log(err);
            }else if(result){
                result.remove();
                res.render("admindashboard");
            }
        })
   })
   router.get("/edittask/:id",ensureAuthenticated, async (req,res)=>{
    await Task.findById(req.params.id, (err, result)=>{
        if(err){
            console.log(err);
        }
        else if(result){
            res.render("update", {works: result});
        }
    })});
    router.post("/updatetask/:id",ensureAuthenticated, async (req, res)=>{
        await Task.findById(req.params.id, (err, result)=>{
            if(err){
                console.log(err)
            }else if(result){
                result.task = req.body.task;
                result.assigned = req.body.name;
                result.save();
                res.render("admindashboard")
            }
        })
    })
    router.get("/admindashboard",ensureAuthenticated, (req, res)=>{
        res.render("admindashboard")
    })
    router.get("/check", async (req, res)=>{
        const work = await Task.find()
        res.render("admintask", {task: work})
    })

   
module.exports = router