class Reviews {
    constructor(options) {
        this.id = Reviews.getNextId();
        this.author = options.author;
        this.date =  require('./currentDate.js');
        this.comment = options.comment;
        this.rating = makeRating().rating;
    }
    static getNextId() {
        return ++Reviews.counter;
    }
};
    Reviews.counter = 0;
    function makeRating(){
        let rating = new Map();
        rating.set("service",5);
        rating.set("price",5);
        rating.set("value",5);
        rating.set("quality",5);
        return{ rating};
    };

    let getArrayReviews = function(){
        return Reviews.userReviews;
    };

    module.exports = Reviews;
