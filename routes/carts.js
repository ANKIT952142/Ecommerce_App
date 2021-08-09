const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo=require('../repositories/products');
const cartShowTemplate=require('../views/carts/show');

const router = express.Router();

// Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // Figure out the cart! check if this device browser have added an item before or not if not it
  //is going to assign a specific random id & create a cart also the cookie store the id for futute
  // refrence for this browser
  let cart;
  if (!req.session.cartId) {                //if we don't found a cartId in the req.session(cookie) means this device browser hven't added an item into the cart before                 
    // We dont have a cart, we need to create one,
    // and store the cart id on the req.session.cartId
    // property
    cart = await cartsRepo.create({ items: [] });           //creating an items empty array in cart
    req.session.cartId = cart.id;
  } else {
    // We have a cart! Lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem=cart.items.find(item=> item.id === req.body.productId);       //checking if the added cart product is already been added
  // here req.body.productId specify the item which has been added to the cart
  if(existingItem){
  // Either increment quantity for existing product
    existingItem.quantity++;
  }else{
  // OR add new product to items array
    cart.items.push({id: req.body.productId, quantity: 1});
  }

  await cartsRepo.update(cart.id,{
      items: cart.items
  });

  res.redirect('/cart');
});

// Receive a GET request to show all items in cart
router.get('/cart',async (req,res)=>{
    if(!req.session.cartId){                //if the person don't have a cart
        res.redirect('/');
    }
    const cart=await cartsRepo.getOne(req.session.cartId);
    for(let item of cart.items){
        const product=await productsRepo.getOne(item.id);           //storing all the items in the product 
        item.product=product;
    }
    res.send(cartShowTemplate({ items: cart.items}));
});

// Receive a post request to delete an item from a cart
router.post('/cart/products/delete', async(req,res)=>{
    const {itemId}=req.body;
    const cart=await cartsRepo.getOne(req.session.cartId);

    const items=cart.items.filter(item=>item.id !== itemId);        //here itemId is coming form the item user choose to delete
    //means we are storing all other items other than the user clicked for delte into items variable
    await cartsRepo.update(req.session.cartId,{items: items});

    res.redirect('/cart');
})
module.exports = router;
