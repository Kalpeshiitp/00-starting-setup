// Import the 'fs' (File System) and 'path' modules
const fs = require('fs');
const path = require('path');

// Define the file path for the cart data JSON file
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

// Export a Cart class with various methods
module.exports = class Cart {
  // Static method to add a product to the cart
  static addProduct(id, productPrice) {
    // Fetch the previous cart from the JSON file
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart to find an existing product with the same ID
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // If the product already exists in the cart, increase its quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // If the product is not in the cart, add it with a quantity of 1
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      // Update the total price in the cart
      cart.totalPrice = cart.totalPrice + +productPrice;
      // Write the updated cart back to the JSON file
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  // Static method to delete a product from the cart
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find(prod => prod.id === id);
  
      if (!product) {
        return;
      }
  
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
  
      // Write the updated cart back to the JSON file
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
  
  // Static method to fetch the cart data and pass it to a callback function
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        // If an error occurs while reading the file, pass null to the callback
        cb(null);
      } else {
        // Pass the cart data to the callback
        cb(cart);
      }
    });
  }
};
