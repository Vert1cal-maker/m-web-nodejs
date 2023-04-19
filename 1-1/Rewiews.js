function Reviews(author, comment, service, price, value, quality){
    if(typeof author !== 'string'|| author=== null){
        throw new Error("Name argument must be String")
    } else if(typeof comment !== 'string'|| comment=== null){
        throw new Error("description argument must be string")
    } 

    this.id = Reviews.getNextId();
    this.author = author;
    this.date = require('./CurrentDate.js');
    this.comment = comment;
    this.rating = {service,price,value,quality};
};

Reviews.counter = 0;
Reviews.prototype.getAverageRating =function() {
   let sum = 0;
   let count = 0;
   for (const key in this.rating) {
    sum+=this.rating[key];
    count++;
   }
   return sum/count;
}

Reviews.getNextId = function(){
        return ++ Reviews.counter;
}
    module.exports = Reviews;
