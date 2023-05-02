const AbstractProduct = require("./AbstractProduct.js");
const Reviews = new require("./Rewiews.js");

function Clothes(name, description, price, brand, quantity, material, color) {
  AbstractProduct.call(this, name, description, price, brand, quantity);
  this.material = material;
  this.color = color;
  this.sizes = [];
  this.activSize = this.sizes[0];
}

Clothes.prototype = Object.create(AbstractProduct.prototype);
Clothes.prototype.constructor = Clothes;

Clothes.prototype.sort = function (array, rule) {
  sortLogic = function (products, sortRule) {
    let itemFromProducts = [];
    let rules = sortRule.toLowerCase();
    if (rules == "name" || rules == "id" || rules == "price") {
      products.map((items) => {
        itemFromProducts.push(items[rules]);
      });
    } else {
      throw new Error("Expected: " + "Price or Id or name");
    }
    if (rules == "name") {
      return qSort(itemFromProducts).reverse();
    }
    return qSort(itemFromProducts);
  };

  qSort = function (array, left = 0, right = array.length - 1) {
    if (array.length > 1) {
      const index = getPart(array, left, right);
      if (left < index - 1) {
        qSort(array, left, index - 1);
      }
      if (index < right) {
        qSort(array, index, right);
      }
    }
    return array;
  };

  getPart = function (arr, left, right) {
    const mid = arr[Math.floor((left + right) / 2)];
    while (left <= right) {
      while (arr[left] < mid) {
        left++;
      }
      while (arr[right] > mid) {
        right--;
      }
      if (left <= right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
      }
    }
    return left;
  };
  return sortLogic(array, rule);
};

Object.assign(Clothes.prototype, {
  getFullInformation() {
    return `name : ${this.name}\ndescription : ${this.description}\nprice : ${this.price}\nbrand : ${this.brand}\nquantity : ${this.quantity}\nmaterial : ${this.material}\ncolor : ${this.color}`;
  },
  getPriceForQuantity(int) {
    return `$` + this.quantity * int;
  },
  addSize(value) {
    if (Array.isArray(value)) {
      this.sizes = value;
    } else {
      this.sizes.push(value);
    }
  },
  getSizes() {
    return this.sizes;
  },
  selectSize(arg) {
    this.activSize = this.sizes[arg];
  },
  getMaterial() {
    return this.material;
  },
  setMaterial(material) {
    this.material = material;
  },
  getAverageRating() {
    let sum = 0;
    let count = 0;
    for (const key in this.reviews) {
      sum += this.reviews[key].getAverageRatingProduct();
      count++;
    }
    return sum / count;
  },
  searchProducts(productArray, searchItem) {
    let faund = [];
    for (let index = 0; index < productArray.length; index++) {
      if (
        productArray[index].name
          .toLowerCase()
          .indexOf(searchItem.toLowerCase()) !== -1 ||
        productArray[index].description.indexOf(searchItem.toLowerCase()) !== -1
      ) {
        faund.push(productArray[index]);
      }
    }
    return faund;
  },
});

const product1 = new Clothes(
  "T-shirt",
  "Just stuff",
  101,
  "Nike",
  56,
  "Cotton",
  "Red"
);
const product2 = new Clothes(
  "Hoodie",
  "Comfy and warm",
  102,
  "Adidas",
  80,
  "Polyester",
  "Black"
);
const product3 = new Clothes(
  "Jeans",
  "Stylish and durable",
  103,
  "Levi's",
  120,
  "Denim",
  "Blue"
);

let products = [];
let sizesProducts = ["XS", "S", "M", "L", "XL", "XLL"];
products.push(product1);
products.push(product2);
products.push(product3);

const review1 = new Reviews(
  "John Doe",
  "Great service and good value for money.",
  4,
  5,
  4,
  5
);
const review2 = new Reviews(
  "Jane Smith",
  "Average service, but expensive.",
  2,
  3,
  2,
  3
);
const review3 = new Reviews(
  "Bob Johnson",
  "Poor service and not worth the price.",
  1,
  2,
  1,
  1
);

