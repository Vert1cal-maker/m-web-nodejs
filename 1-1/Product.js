function Product(name, description, price, brand, quantity){
    if(typeof name !== 'string'|| name === null){
        throw new Error("Name argument must be String")
    } else if(typeof description !== 'string'|| description === null){
        throw new Error("description argument must be string")
    } else if(!this.isFloat(price)){
        throw new Error("price argument must be Float")
    } else if(typeof brand !== 'string'|| brand === null){
        throw new Error("price argument must be String")
    } else if(this.isFloat(quantity) || typeof quantity !== 'number'  || quantity === null){
        throw new Error("quantity argument must be Intenger")
    } 
    this.id = Product.getNextId();
    this.name = name;
    this.description = description;
    this.price = price;
    this.brand = brand;
    this.quantity = quantity;
    this.sizes = ['XS', 'S', 'M', 'L', 'XL', 'XLL']
    this.activeSize = this.sizes[0];
    this.date = require('./CurrentDate.js');
    this.reviews = [];
    this.images = ["short","boots","t-shirts"];
};

Product.counter = 0;
Product.prototype.searchSize = function(size){
    console.log( this.sizes.find(size));
    return 0;
} 
Product.prototype.isFloat = function(arg){
    return typeof arg === 'number' && !isNaN(arg) && arg % 1 !== 0;
}

Product.prototype.addReview = function(review){
    this.reviews.push(review);
};

Product.prototype.searchSize = function(size){
    if(this.sizes.indexOf(size)!=-1){
        return this.sizes[this.sizes.indexOf(size)];
    } 
    return this.sizes[0];
} 

Product.prototype.deleteReview = function(key){
            this.reviews.splice(key,1);
};

Product.prototype.getReviewById = function(id){
  return this.reviews[id];
}

Product.prototype.getImage = function(id){
    if( id === undefined){
        return this.images[0];
    } else {
        return this.images[id]; 
    }
}

Product.prototype.addSize = function(id){
   this.sizes.push(id);
  }

Product.prototype.deleteSize = function(key){
    for (let ind = 0; ind < this.sizes.length; ind++){
        if(key == this.sizes[ind]){
            this.sizes.splice(ind,1);
        }
    }
}

Product.prototype.getAverageRating = function(){
    let sum = 0;
    let count = 0;
  for (const key in this.reviews) {
    sum += this.reviews[key].getAverageRating();
    count++;
  }
  return sum/count;
}

Product.getNextId = function(){
    return ++ Product.counter;
};

Product.prototype.getName = function(){
    return this.name;
}
Product.prototype.setName=function(arg){
    this.name = arg;
}
Product.prototype.getDescription = function(){
    return this.description;
}
Product.prototype.setDescription=function(arg){
    this.name = arg;
}
Product.prototype.getPrice = function(){
    return this.price;
}
Product.prototype.setPrice=function(arg){
    this.price = arg;
}
Product.prototype.getBrand = function(){
    return this.brand;
}
Product.prototype.setBrand=function(arg){
    this.brand = arg;
}
Product.prototype.getQuantity = function(){
    return this.quantity;
}
Product.prototype.setQuantity = function(arg){
   this.quantity = arg;
}

Product.prototype.getSizes = function(){
    return this.sizes;
}
Product.prototype.setSizes = function(arg){
    if(typeof arg !== "object"){
        throw new Error("must be Array");
    }
   this.sizes = arg;
}

Product.prototype.getActiveSize = function(){
    return this.activeSize;
}
Product.prototype.setActiveSize = function(arg){
   this.activeSize = this.searchSize(arg);
}

Product.prototype.getDate = function(){
    return this.date;
}
Product.prototype.setActiveSize = function(arg){
   this.date = arg;
}

Product.prototype.getReview = function(){
    return this.reviews;
}
Product.prototype.setReview = function(arg){
    if(typeof arg !== "object"){
        throw new Error("must be Array");
    }
   this.reviews = arg;
}

Product.prototype.getReview = function(){
    return this.reviews;
}
Product.prototype.setReview = function(arg){
    if(typeof arg !== "object"){
        throw new Error("must be Array");
    }
   this.reviews = arg;
}

Product.prototype.getImages= function(){
    return this.images
}
Product.prototype.setImages = function(arg){
    if(typeof arg !== "object"){
        throw new Error("must be Array");
    }
   this.images = arg;
}


module.exports = Product;
