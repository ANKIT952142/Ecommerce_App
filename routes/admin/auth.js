const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {         //here req is for a request to the server from the browser & it store request information 
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',                            //telling router to watch for an incoming request of path '/' & post method
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    // const errors = validationResult(req);
    
    // if(!errors.isEmpty()){
    //     return res.send(signupTemplate({ req,errors }));        
    // }
    const { email, password } = req.body;
     //destructuring the the req.body elements

    // const existingUser = await usersRepo.getOneBy({ email });
    // if (existingUser) {
    //   return res.send('Email in use');
    // }

    // if (password !== passwordConfirmation) {
    //   return res.send('Passwords must match');
    // }

    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
  // Store the id of that user inside the users cookie
    // storing the id of that user inside the user cookie-> using a third party install COOKIE-SESSION to have security in case of cookie
    req.session.userId = user.id;          // added by cookie session and req.session is a object which maintains  the information


    res.redirect('/admin/products');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;                 //deleting all the data stored inside a cookie to sign out
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));           // for sign in we need to give a signin form to user and apply a post request on the details entered by the user   
});

router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
     //  const errors = validationResult(req);
  //  if(!errors.isEmpty()){
  //    return res.send(signinTemplate({errors: errors })); 
  //  }
    const { email } = req.body;           //getting the email & password from the form which is in req.body

    const user = await usersRepo.getOneBy({ email });        //checking if the email is signedup or not in database
  // if (!user) {
  //   return res.send('Email not found');
  // }
    req.session.userId = user.id;          // this indicates that cooking have this users id & signed in

    res.redirect('/admin/products');
  }
);

module.exports = router;
