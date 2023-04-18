function Product(product){
    if(typeof product!=='object' || product===null){
        throw new Error('Product constructor argument must be an object');
    }

    this.id = Product.getNextId();
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.brand = product.brand;
    this.sizes = arraySizes;
    this.activeSize = this.sizes[0];
    this.quantity = product.quantity;
    this.date =   require('./currentDate.js');
    this.reviews = [];
    this.images = [];
};


function createProduct(options){
    if(typeof options.name!=='string' || options.name===null){
        throw new Error('Name argument must be String');
    } 

    return{
        name : options.name,
        description : options.description,
        price : options.price,
        brand : options.brand,
        quantity : options.quantity,
    }
};

let arraySizes = ['XS', 'S', 'M', 'L', 'XL', 'XLL'];


Product.prototype.addReview = function(review){
    this.reviews.push(review);
};

Product.prototype.deleteReview = function(key){
            this.reviews.splice(key,1);
};

Product.prototype.getReviewById = function(id){
  return this.reviews[id];
}


Product.prototype.getImage = function(id){
    if(id === null){
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


Product.counter = 0;
Product.getNextId = function(){
    return ++ Product.counter;
};



module.exports = Product;
