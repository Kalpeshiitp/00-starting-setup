const db = require('../util/database')
const Product = require("../models/product");

// Define a function to render the page for adding a new product
exports.getAddProduct = (req, res, next) => {
  // Render the 'edit-product' view with information for adding a new product
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

// Define a function to handle the submission of a new product
exports.postAddProduct = (req, res, next) => {
  // Extract product information from the request body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Create a new product instance with the extracted information and save it
  const product = new Product(null, title, imageUrl, description, price);
  product.save();

  // Redirect the user to the homepage after adding the product
  res.redirect("/");
};

// Define a function to render the page for editing a product
exports.getEditProduct = (req, res, next) => {
  // Check if 'editMode' is set in the query parameters, if not, redirect to the homepage
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  // Extract the product ID from the request parameters
  const prodId = req.params.productId;

  // Find the product by ID and render the 'edit-product' view for editing
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

// Define a function to handle the submission of edited product information
exports.postEditProduct = (req, res, next) => {
  // Extract updated product information from the request body
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // Create a new product instance with the updated information and save it
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Define a function to render the list of admin products
exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([row,fielddata])=>{
      res.render("admin/products", {
        prods: row,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    
  }).catch(err=>{
    console.log(err)
  })
};




// Define a function to handle deleting a product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('Product deleted from the database.');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};
