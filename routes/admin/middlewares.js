const { validationResult } = require('express-validator');       //for comparing the passwords & correct emails


module.exports = {
  handleErrors(templateFunc,dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);              //storing in errors from validationreasult if we found any like title length is too short

      if (!errors.isEmpty()) {
        let data={};
        if(dataCb){
          data=await dataCb(req);           //storing all the data from data_callback
        }
        return res.send(templateFunc({ errors, ...data }));       //if dataCb is present we are going to spread it with the errors with data inside the dataCb
      }

      next();                     //called if no errors at found
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    next();
  }
};
