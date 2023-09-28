// Import the 'fs' (File System) and 'path' modules
const fs = require('fs');
const path = require('path');

// Import the 'Cart' module
const Cart = require('./cart');

// Define the file path for the product data JSON file
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

// Define a function to read products from the JSON file
const getProductsFromFile = cb => {
  // Read the file and parse its content to JSON, then pass it to a callback function
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      // If an error occurs while reading, call the callback with an empty array
      cb([]);
    } else {
      // Parse the file content to JSON and call the callback with the parsed data
      cb(JSON.parse(fileContent));
    }
  });
};

// Export a Product class with various methods
module.exports = class Product {
  // Constructor to create a Product instance with specified properties
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Method to save the product data to the JSON file
  save() {
    // Read products from the file, update or add the product, and then save it back to the file
    getProductsFromFile(products => {
      if (this.id) {
        // If the product already has an ID (exists), update it in the products array
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        // Write the updated products array back to the file
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        // If the product doesn't have an ID (new product), generate a random ID and add it to the array
        this.id = Math.random().toString();
        products.push(this);
        // Write the updated products array back to the file
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  // Static method to delete a product by ID
  static deleteById(id) {
    // Read products from the file, find and remove the product, and then save the updated list
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      // Write the updated products array back to the file
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          // If the write was successful, also remove the product from the cart
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  // Static method to fetch all products and pass them to a callback function
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  // Static method to find a product by its ID and pass it to a callback function
  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
