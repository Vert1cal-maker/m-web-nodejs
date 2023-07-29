import { type } from "node:os";
import { Interface } from "node:readline";
import { it } from "node:test";

type DialogButtonType = "Yes" | "No";

interface FormButton {
  type: "Add" | "Remove" | "Buy";
  onConfirm?: (params: DialogButtonType) => void; // adding new field on interface
}

// задача 1: создайте тип AnyButtonType, который описывает все вариации кнопок
type AnyButtonType = DialogButtonType | FormButton;

const test1: AnyButtonType = "No";
const test2: AnyButtonType = {
  type: "Remove",
};

// задача 2: создайте тип ConfirmationHandlingFormButton
// т.е. подтип формовых кнопок, которые ещё содержат поле onConfirm, в котором
// может лежать функция, которая вызывается с параметром типа DialogButtonType
// (и ничего не возвращает)
// Т.е. предполагается что у кнопки такого типа, если поле onConfirm пустое,
// то при нажатии на эту кнопку сразу происходит действие
// а иначе вызывается диалог Подтверждения, и результат нажатия на кнопку Да или Нет
// в итоге попадет в функцию onConfirm, которая уже дальше решит что делать

// firs variant
type ConfirmationHandlingFormButton = FormButton;

// second
type ConfirmationHandlingFormButton1 = FormButton & {
  onConfirm: (par: DialogButtonType) => void;
};

// Есть функция. Она принимает некий объект А, у которого есть поля со значениями
// - или undefined
// - или объекта с одним полем cvalue, который
//      либо undefined
//      либо по типу равный
//           либо строке,
//           либо числу,
//           либо ссылке на объект по своей структуре/описанию подобный описываемому объекту А.
// ...Функция должна вернуть сумму "значений" поля cvalue всех полей объекта, притом,
// - если у очередного элемента поле сvalue - это число,
// то просто добавляем это число.
// - если у очередного элемента поле сvalue - это строка,
// то просто конвертим строку в число и добавляем.
// - если у очередного элемента поле cvalue - это объект подобный корневому,
// то добавляем сумму его полей (привет рекурсия)
// - если мы натыкаемся на undefined, или же если cvalue был строкой которая по факту не являлась адекватным числом -
// то тогда значением будет 2022.

// например, для { hello: {cvalue: 1}, world: { cvalue: { yay: { cvalue: "2" } } } }
// должно вернуться 3

type A = Record<string,B>

interface B {
    cvalue?: A | string | number;
}

function objectSum(value: A | undefined): number {
  if (!value) {
    return 2022;
  }

  let result =  Object.values(value).reduce((acum: number, current: B): number => {
      if (!current.cvalue) {
        return 2022;
      } else if (typeof current.cvalue === "string") {
        return acum + ( +current.cvalue || 2022);
      } else if (typeof current.cvalue === "number") {
        return acum + current.cvalue;
      } else if (isB(current)) {
        return (acum + objectSum(current.cvalue));
      } 
      return acum;
    },
    0
  );
  
  return result;
}

function isB(b:object): b is B{

    return !!b && "cvalue" in b;
}

const test: A = {
  hello: {
    cvalue: 1,
  },
  world: {
    cvalue: {
      yay: {
        cvalue: "2",
      },
    },
  },
};

// const sum = objectSum(test);
// console.log(sum)


// Скоро дадим вам функцию, но она немного багонутая.
// Попробуйте найти в ней все баги самостоятельно без запуска этого кода.
// Когда вы увидели все баги и готовы их исправлять, то сделайте это (НО НЕ НАДО ПЕРЕПИСЫВАТЬ С НУЛЯ :)) ),
// и когда будете уверены что функция работает ок - можете попробовать запустить ее и потестить.
// Перед запуском изучите, что ваш любимый редактор подсвечивает в коде.
// Нашел ли он какие-то ошибки?
// Если допустить, что все-таки вы пропустили ряд ошибок, то время протестировать тайпскрипт.

// 1) сложный этап. напишите нормальную тайпскриптовую сигнатуру функции
// (отдельно опишите тип первого аргумента в виде interface)

// 2) если не получилось, смотрите спойлер: https://pastebin.com/2nEJvk04

// 3) пользуясь силой тайпскрипта и описанной сигнатуры,
// найдите как можно больше ошибок, которых не нашли раньше.
// По мере фикса кода, обнаруживайте еще ошибки на шару в процессе кодинга,
// без запуска программы.
// результат скиньте @roman

// ... а вот и код багонутой функции:

// function summ(a) {
//     const x = Object.keys(a).map((k) => {
//         const elem = a[k];
//         if (typeof elem === undefined) return 2021;
//         if (typeof elem.cvalue === 'String') return +elem.cvalue || '2021';
//         if (elem.cvalue.isBigObject !== undefined) return summ(elem);
//         return elem.сvalue;
//     });
//     let sum = 0;
//     for (let i = 0; i < x.lenght; i++) {
//         sum += x[i].cvalue;
//     }
//     return summ;
// }

type A1 = Record<string,B>

function summ(a: A1): number {
  const x = Object.keys(a).map((k) => {
    const elem = a[k];
    if (!elem) return 2021;

    if (typeof elem?.cvalue === "string") return +elem.cvalue || 2021;

    if (typeof elem?.cvalue === "number") return elem.cvalue;

    if (isB(elem) && elem.cvalue) return summ(elem.cvalue);
  });

  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    const target = x[i];
    if (target) {
      sum += target;
    }
  }
  return sum;
}

const obj: A1 = {
    first: { cvalue: 5 },
    second: { cvalue: "10" },
    third: { cvalue: { nested1: { cvalue: 15 }, nested2: { cvalue: "20" } } },
  };

  // const res = summ(obj);
  // console.log(res)

// Удачи найти все баги.
// Тут может быть проще все с нуля написать, но задача не об этом.
// А про то, как находить ошибки не напрягаясь.
// И про type narrowing:
// - про guards: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards
// - про truthiness narrowing: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing
// - про control flow analysis: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#control-flow-analysis

// Дайте знать @roman про результаты.


// Напишите функцию mapObject, которая
// в чем-то очень похожа на функцию map для массивов.

// Эта функция должна принимать объект джаваскрипта
// и функцию transformer, которую нужно применить к каждому из полей того объекта, 
// ...а из результата применения функции transformer к каждому полю входящего объекта
// собрать новый объект и вернуть его.

// Так например можно будет замэппить объект типа 
// { "roma" : 5, "vasya": 2 } оценок студентов
// на функцию вроде (x) => x > 2
// чтобы получить объект 
// { "roma": true, "vasya": false } зачетов студентов

// Понятное дело для описания сигнатуры mapObject надо будет юзать
// 1) дженерики с несколькими параметрами-типами
// 2) такую штуку как Record (globalThis.Record, если быть точным ;) )

type FirstData<T> = Record<string,T>;
type SecondData<N> = Record<string,N>;

function mapObject<Input,Output>(input:FirstData<Input>, transformer:(arg:Input)=>Output):SecondData<Output>{
  return Object.entries(input).reduce((acum:SecondData<Output>, [key,value]):SecondData<Output>=>{
    return {
      ...acum,
      [key] : transformer(value),
    }
  },{});
}

const test4 = {
  "roma" : 5, 
  "vasya": 2
}

console.log(mapObject(test4, (n)=>n*2));

// Напишите функцию, которая принимает:
// 1) некие данные предполагаемо типа Т, но возможно не со всеми полями
// 2) функцию-дополнятор, которая принимает такие штуки как из п.1, 
//    а возвращает полноценный объект типа Т
// ... как вы поняли, саму функцию писать не надо :) 
// нас интересует только ее сигнатура.




function firstFunction<T>(item:Partial<T>):void{};

function firstAddons<T>(item:Partial<T>, add: Required<T>): T{
  return {...item, ...add};
};

// Более сложный вариант:
// Напишите функцию, которая принимает:
// 1) некие данные предполагаемо типа Т (у которого поле id: string), 
//    но возможно без поля id
// 2) функцию-дополнятор, которая принимает такие штуки как из п.1, 
//    а возвращает полноценный объект типа Т
// ... как вы поняли, саму функцию писать не надо :) 
// нас интересует только ее сигнатура.

function secondFunction<T>(item: Extract<T,{id?:string}>):void{};
function secondAddons<T>(item: Extract<T,{id?:string}>, add:Required<T>):T{
  return {...item, ...add};
};

// Последняя задача:
// Напишите сигнатуру функции, которая принимает
// - некий класс 
// - количество
// ...а возвращает массив экземпляров этого класса

class Rectangle {
  w!: number;
  h!: number;
}
class Circle {
  radius!: number;
}


type Constructor<T> = {
  new ():T; 
}

// сделайте норм сигнатуру тут.
// НЕТ, Rectangle|Circle это не вариант, надо сделать универсальную функцию 
function наштамповать<T>(SOMECLASS: Constructor<T>, count:number): T[] {
  let a:T[] = []
  for (let i = 0; i < count; i++)
     a.push(new SOMECLASS());
 
  return a;
}

let a: Rectangle[] = наштамповать(Rectangle, 10);
let b: Circle[] = наштамповать(Circle, 20)


