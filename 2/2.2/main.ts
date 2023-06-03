
///// Task 1
const getMyIp = fetch("https://api.ipify.org/?format=json").then(data => data.json()).then(data => console.log(data.ip))
console.log(getMyIp)

///// Task 2
async function getResponse() {
    const res = await fetch("https://api.ipify.org/?format=json");
    const data = await res.json();
    console.log(data.ip);
}

///// Task 3
///// Part 1 (with async/await + Promise.All)
async function getNamesWithAsync(url: string, getCount: number) {
    const fetches = Array.from({ length: getCount }, () => fetch(url));
    const responses = await Promise.all(fetches);
    const data = await Promise.all(responses.map(async response => await response.json()));
    console.log(data.map(item => item.name));
}

getNamesWithAsync("https://random-data-api.com/api/name/random_name", 3);

///// Part 2 (with async/await)

async function getNamesWitoutPromiseAll(url: string, getCount: number) {
    const fetches = Array.from({ length: getCount }, () => fetch(url));
    const dataPromise = fetches.reduce(async (accumulate, fetchItem) => {
        const acc = await accumulate;
        const response = await fetchItem;
        const data = await response.json();
        const name = data.name;
        return [...acc, name];
    }, Promise.resolve<Response[]>([]));

    const result = await dataPromise;
    console.log(result);
}

///// Part 3 (only Promise)
function getNames(url: string, mountOfRequest: number): Promise<string[]> {
    const promises = Array.from({ length: mountOfRequest }, () => fetchName(url))
    return PromiseAll(promises);
}


function PromiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = [];
        promises.forEach(element => {
            element.then(data => {
                results.push(data);
                if (results.length === promises.length) resolve(results);
            })
        });
    });
}


function fetchName(url: string): Promise<string> {
    return fetch(url)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw Error("err");
            }
        }).then(data => data.name);
}


getNames("https://random-data-api.com/api/name/random_name", 3).then(data => console.log(data));



/////// task 4
//      without asinc/await
function getWoomansName(): Promise<string> {

    return fetch("https://random-data-api.com/api/users/random_user").
        then(response => response.json())
        .then(data => {
            if (data.gender === "Female") {
                return data.gender;
            } else {
                return getWoomansName()
            }
        });
}

getWoomansName().then(data => console.log(data))

//       with asinc await
async function getWooman(): Promise<string> {
    const response = await fetch("https://random-data-api.com/api/users/random_user");
    const data = await response.json();
    if (await data.gender === "Female") {
        return data.gender;
    } else {
        return getWooman();
    }
}

getWooman().then(gender => console.log(gender));


//////////task 5

function firstFunction<T>(callback: (ip: Promise<T>) => Promise<T>) {
    const myIp = fetch("https://api.ipify.org/?format=json").then(response => response.json());
    return callback(myIp);
}

async function secondFunction<T>(): Promise<T> {
    return await firstFunction(callback);
}

function callback<T>(prom: Promise<T>): Promise<T> {
    return prom;
}

secondFunction().then(data => console.log(data));



/// another version 
function func1(fn: (ip: string) => void) {
    fetch("https://api.ipify.org/?format=json")
        .then(res => res.json())
        .then(fn);
}

function callbackFn(ip: string) {
    console.log(ip);
}

function func2() {
    func1(callbackFn);
}

func2();


/////////// task 6

function firstFn() {
    return fetch("https://api.ipify.org/?format=json").then(response => response.json());
}

async function secondFn<T>(callback: (ip: Promise<T>) => void) {
    const myIp = await firstFn();
    callback((myIp));
}

function test(response: Promise<string>) {
    console.log(response)
}

secondFn(test);
