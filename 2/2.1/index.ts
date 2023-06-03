
// 1.

function getFirstWord(a: string) {
	return a.split(/ +/)[0].length;
}

// 2.

function getUserNamings(a: {name: string, surname: string}) {
  return {
		fullname: a.name + " " + a.surname,
		initials: a.name[0] + "." + a.surname[0]
	};
}

// // 3.
// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining>
type getAllProductNamesProps = {
  products?:Array<{name?:unknown}>
}
function getAllProductNames(a: getAllProductNamesProps ) {
return a?.products?.map(prod => prod?.name) || [];
}


// 4.1
// easy way is using 'as' keyword
// hard way is ?...

type personInfo = {
  name: () =>string,
  cuteness?: number,
  coolness?: number
}

function hey(a: personInfo) {
    return "hey! i'm " + a.name();
}
hey({name: () => "roma", cuteness: 100});
hey({name: () => "vasya", coolness: 100});



// // 4.2
abstract class Animal{
  petName: string = "animal";
  name():string {
    return this.petName;
  }
}

class Cat extends Animal{
  wild: boolean;
  constructor(name: string, wild: boolean ){
    super();
    this.petName = name;
    this.wild = wild;
  }
}

class Dog extends Animal{
  years: number;
  constructor(name: string, years: number ){
    super();
    this.years = years;
    this.petName = name;
  }
}


function hey2(abstractPet: Dog|Cat) {
    return "hey! i'm " + abstractPet.name();
}
let a = new Cat("myavchik", true)
let b = new Dog("gavchik", 333)
hey2(a)
hey2(b)




// 4.3
type AnimalType = {
  name: () => string,
  type: string,
  cuteness?: number,
  coolness?: number
}

function hey3(a: AnimalType) {
    return "hey! i'm " + a.name()
		 + (a.type === "cat" ? ("cuteness: "+a.cuteness) : ("coolness: "+a.coolness))
}
hey3({name: () => "roma", type: "cat", cuteness: 100})
hey3({name: () => "vasya", type: "dog", coolness: 100})

// 5.

// google for Record type
function stringEntries(a: {}|[]) {
   return Array.isArray(a) ? a : Object.keys(a)
}


// // 6.
//
// // you don't know Promises and async/await yet. Or do you?
// // ....can be hard, don't worry and SKIP if you do not know how to do it
//
async function world(a: number) {
  return "*".repeat(a);
}

const hello: Function  = async (): Promise<string> => {
return await world(10)
}

hello().then((r: string) => console.log(r)).catch((e: unknown) => console.log("fail"));
