const express = require('express');         //it requires for create the web server & handling the http request & responding to it
const bodyParser = require('body-parser');          //accessing an outside library for bodyparsing
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter=require('./routes/products');
const cartsRouter=require('./routes/carts');

const app = express();

app.use(express.static('public'));                // find public directory & make it available to the outside world/browser
app.use(bodyParser.urlencoded({ extended: true }));        //included the parser method in app which will use automatically when rquired like in post method & not required in get method

app.use(
  cookieSession({
    keys: ['lkasld235j']           //it is used as a encryption key to encrypt the data inside a cookie so that user can't fetch the information from cookie only browser can do that
  })
);
app.use(authRouter);
app.use(productsRouter);          //associating the product router with the app
app.use(adminProductsRouter);
app.use(cartsRouter);

// const bodyParser=(req,res,next)=>{      //this is middleware function which parse the data into readable form into formdata and the call NEXT callback function which continue the express

//   if(req.method ==='POST'){             //if a post request then hold the express parse it and continue the express uing next
//   req.on('data',(data)=>{               //same as to req.addEventListener on data event
//     const parsed=data.toString('utf8').split('&');
//     const formData={};
//     for(pair of parsed){
//       const [key,value]=pair.split('=');    //using destructring to add key and value
//       formData[key]=value;
//     }
//     req.body=formData;
//     next();
//   });
// }
//   else{
//     next();
//   }
// }


app.listen(3002, () => {            //start listening incoming request on a particular port 
  console.log('Listening');
});
