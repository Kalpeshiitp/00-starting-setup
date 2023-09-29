const db = require('../util/database')
const Cart = require('./cart');

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
    return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUE(?,?,?,?)',
    [this.title,this.price,this.imageUrl,this.description]);
  }

  // Static method to delete a product by ID
  static deleteById(id) {
   return db.execute('DELETE  FROM products WHERE products.id=?',[id])
  }

  
  static fetchAll() {
 return db.execute('SELECT * FROM products')
  }

  // Static method to find a product by its ID and pass it to a callback function
  static findById(id) {
   return db.execute('SELECT * FROM products WHERE products.id=?',[id])
}
}
