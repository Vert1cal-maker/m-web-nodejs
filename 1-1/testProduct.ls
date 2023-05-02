
const Product = new require('./Product.js');
const Reviews = new require('./Rewiews.js');

let nike = new Product("Nike","t-shotr", 101.22, "nike", 55);
let ecco = new Product("Ecco","sneakers", 66.22, "ecco", 23);
let puma = new Product("Puma", "strap", 45.55, "puma", 11);
let lacosta = new Product("Lacosta", "shirtt", 32.55, "lacosta", 25);
let boss = new Product("abb", "strap", 78.15, "lacosta", 13);


let products = [];
products.push(nike);
products.push(ecco);
products.push(puma);
products.push(lacosta);
products.push(boss);


let searchProducts = function(productArray, searchItem){
    let faund = [];
    for (let index = 0; index < productArray.length; index++) {  
        if(productArray[index].name.indexOf(searchItem.toLowerCase())!==-1 ||
         productArray[index].description.indexOf(searchItem.toLowerCase())!==-1  ){
            faund.push(productArray[index]);
        }
    }
    return faund;
}

let sort = function(products, sortRule){
    let itemFromProducts = [];
    let rules = sortRule.toLowerCase();
    console.log(rules);
    if(rules == "name" || rules  == "id"  || rules == "price" ){
        products.map((items) => {
        itemFromProducts.push(items[sortRule]);
    })
    } else {
        throw new Error("Expected: " + "Price or Id or name");
    }
    if(rules == "name"){
        return qSort(itemFromProducts).reverse();
    }
    return qSort(itemFromProducts);
    
   
}

let qSort = function(array, left = 0, right = array.length-1){
    if(array.length> 1){
        const index = getPart(array,left,right);
        if(left<index-1){
            qSort(array, left, index-1);
        }
        if(index< right){
            qSort(array, index, right);
        }
    }
    return array;
}

let getPart = function(arr, left, right){
    const mid = arr[Math.floor((left+right)/2)];
    while(left<=right){
        while(arr[left]< mid){
            left++;
        }
        while(arr[right]>mid){
            right--;
        }
        if(left<= right){
            [arr[left], arr[right]] = [arr[right],arr[left]];
            left++;
            right--;
        }
    }
    return left;
}
