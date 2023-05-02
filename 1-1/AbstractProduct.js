function AbstractProduct(name, description, price, brand, quantity) {
  if (this.constructor === AbstractProduct) {
    throw new Error("Cannot instantiate an abstract class'");
  }
  this.id = AbstractProduct.uniqId++;
  this.name = name;
  this.description = description;
  this.price = price;
  this.brand = brand;
  this.quantity = quantity;
  this.date = require("./CurrentDate.js");
  this.reviews = [];
  this.images = [];
}
AbstractProduct.uniqId = 0;

Object.assign(AbstractProduct.prototype, {
  getDate() {
    return this.date;
  },
  getNameProduct() {
    return this.name;
  },
  setNameProduct(arg) {
    this.name = arg;
  },
  getDescriptionProduct() {
    return this.description;
  },
  setDescriptionProduct(arg) {
    this.description = arg;
  },
  getPriceProduct() {
    return this.price;
  },
  setPriceProduct(arg) {
    this.price = arg;
  },
  getBrandProduct() {
    return this.brand;
  },
  setBrandProduct(arg) {
    this.brand = arg;
  },
  getQuantityBrand() {
    return this.quantity;
  },
  setQuantityBrand(arg) {
    this.quantity = arg;
  },
  getDateCreated() {
    return this.date;
  },
  setDateCreate(arg) {
    this.date(arg);
  },
  getImages() {
    return this.images;
  },
  addReview(rev) {
    this.reviews.push(rev);
  },
  removeReview(key) {
    this.reviews.splice(key, 1);
  },
  getReviews() {
    return this.reviews;
  },
  getReviewById(id) {
    return this.reviews[id];
  },
  addImages(arg) {
    if (Array.isArray(arg)) {
      this.images = arg;
    } else {
      for (let index = 0; index < arguments.length; index++) {
        this.images.push(arguments[index]);
      }
    }
  },
  getterSetter({key,value}){
    if(key in this){
      if(value) {
        this[key] = value;
      } 
      
      return this[key];
    } else{
      throw new Error ("no such field exists");
    }
  },

  getFullInformation() {
    throw new Error("This method must be implement in u instance");
  },
  getPriceForQuantity(int) {
    throw new Error("This method must be implement in u instance");
  },
  sort() {
    throw new Error("This method must be implement in u instance");
  },
  searchProducts() {
    throw new Error("This method must be implement in u instance");
  },
});

(module.exports = AbstractProduct), AbstractProduct.prototype;
