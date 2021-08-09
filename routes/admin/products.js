const express = require('express');
const multer = require('multer');            // middleware for image file upload 


const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });          //multer is going to store the image

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));                   //passing all the products
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  requireAuth,                        // user can only access the form only if they are signed in
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),           //here passing a reference of productnew template so can be called many times
  async (req, res) => {
    const image = req.file.buffer.toString('base64');            //here req.file contains all the form data & in buffer the image string is contained
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });        //creating a product & saving it into product.jason file


    res.redirect('/admin/products');
  }
);


router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {               // here (:id) is a wildcard which will take anything(id)
  const product = await productsRepo.getOne(req.params.id);       //it is going to fetch the product with that specific id

  if (!product) {
    return res.send('Product not found');
  }

  res.send(productsEditTemplate({ product }));
});

router.post('/admin/products/:id/edit',           //this router is for the post request of edited product title price & image
  requireAuth,
  upload.single('image'),                   //we might receive a image upload & we are puuting {image} bz we have an input type=image in the form
  [requireTitle,requirePrice],
  
  
  handleErrors(productsEditTemplate,async(req)=>{         //in case of any error we are going to route back to edit product form
  const product=await productsRepo.getOne(req.params.id); 
    return({product: product});                       
    //in the handleErrors function we are checking for any error & passing also the product data
  }),
  
  

  async(req,res)=>{

    const changes=req.body;                 
    if(req.file){                           //if user have uploaded a new file/image
      changes.image=req.file.buffer.toString('base64');       //we are going to store that into a base64 converted form in the req.body
    }

  try{
    await productsRepo.update(req.params.id,changes);       //update might give an error so using try/catch
  }catch(err){
    return res.send('could not find the item');
  }
  res.redirect('/admin/products');              // if evrything went right user will be redirected t products list page
});


router.post('/admin/products/:id/delete',requireAuth,async (req,res)=>{       // using only post route handler is bz we just want a post request to delete the product don't anything to be filled by user
  await productsRepo.delete(req.params.id);
  res.redirect('/admin/products');
})
module.exports = router;
