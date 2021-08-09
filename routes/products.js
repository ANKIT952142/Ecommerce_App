const express=require('express');
const productsRepo=require('../repositories/products');
const productsIndexTemplate=require('../views/products/index');

const router=express.Router();

router.get('/',async (req,res)=>{
    const products=await productsRepo.getAll();
    res.send(productsIndexTemplate({products: products}));              //passing the products to the index file for showing it
});
module.exports=router;