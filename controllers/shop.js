// Import the 'Product' and 'Cart' models
const Product = require("../models/product");
const Cart = require("../models/cart");

// Define a function to handle the route for displaying all products
exports.getProducts = (req, res, next) => {
  // Fetch all products and pass them to the 'product-list' view for rendering
  Product.fetchAll()
  .then(([row, fielddata]) => {
    res.render("shop/product-list", {
      prods: row,
      pageTitle: "All Products",
      path: "/products",
    });
  })
  .catch((err) => {
    console.log(err);
  });;
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// Define a function to handle the route for displaying the main shop page
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([row, fielddata]) => {
      res.render("shop/index", {
        prods: row,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Define a function to handle the route for displaying the shopping cart
exports.getCart = (req, res, next) => {
  // Retrieve the cart data and fetch all products
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      // Loop through products and match them with items in the cart
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        // If a matching item is found in the cart, add it to the cartProducts array
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      // Render the 'cart' view with the cart product data
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

// Define a function to handle adding a product to the cart
exports.postCart = (req, res, next) => {
  // Extract the product ID from the request body
  const prodId = req.body.productId;
  // Find the product by ID and add it to the cart
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  // Redirect the user to the cart page
  res.redirect("/cart");
};

// Define a function to handle removing a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(([product])=>{
    product => {
      Cart.deleteProduct(prodId, product.price);
      res.redirect("/cart");
    }
  }).catch(err=>{
    console.log(err)
  })
};

// Define a function to handle the route for displaying the user's orders
exports.getOrders = (req, res, next) => {
  // Render the 'orders' view for displaying the user's orders
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

// Define a function to handle the route for the checkout page
exports.getCheckout = (req, res, next) => {
  // Render the 'checkout' view for the checkout process
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
