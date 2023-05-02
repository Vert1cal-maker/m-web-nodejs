const AbstractProduct = require("./AbstractProduct.js");

function Electronics(
  name,
  description,
  price,
  brand,
  quantity,
  warranty,
  power
) {
  AbstractProduct.call(this, name, description, price, brand, quantity);
  this.warranty = warranty;
  this.power = power;
}

Electronics.prototype = Object.create(AbstractProduct.prototype);
Electronics.prototype.constructor = Electronics;

Object.assign(Electronics.prototype, {
  getWarranty() {
    return this.warranty;
  },
  setWarranty(value) {
    this.warranty = value;
  },
  getPower() {
    return this.power;
  },
  setPower(value) {
    this.power = value;
  },
});

const robot = new Electronics("B8", "robot", 988, "Sumsung", 11, 4, 220);
const robot2 = new Electronics("B8", "robot", 988, "Sumsung", 11, 4, 220);
