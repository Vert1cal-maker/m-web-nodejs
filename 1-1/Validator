let validateEmail = function(string){
    const regex = /^[a-zA-Z\d\-\.\+]{1,29}\@[\w\d\.\!\$\%\'\*\+\/=\?\^\_\-]{1,15}\.[a-zA-z]{1,5}$/gm
    return regex.test(string);
}

/// valide emeil 
let valideEmeil = ["fi@secondpart.end", "first-part@.se=cond%p.art.end", "first.part@se=cond%part.r"];

/// not valide emeil
let notValidEmeil= ["f@secondart.end,","+first-part@.se=cond@part.end","+-firstpart@.se=cond%.enddeded","firs_tpart@.se.en","firstpart@.se.enddeded"];

console.log("Testing Emeil validation: ");
for (const key in valideEmeil) {
    console.log(validateEmail(valideEmeil[key]));
}
console.log("========================================");
for (const key in notValidEmeil) {
      console.log(validateEmail(notValidEmeil[key]));
}




let validatePhone = (numbers) =>{
    if(numbers.lenght>25){
        throw new Error("long inpuy");
    }
    const regex = /^(\+38)?([\s\-]*)?\(?(?:\d\s*[\-\s\)]*){10}$/gm
    return regex.test(numbers);
}

/// valide phone number
let valideNumber = ["+38 (099) 567 8901", "+38 (099) 567 8901", "(09-9) 567-890-1","--(099) 567 890-1"];

/// not valide phone number
let notValidNumber = ["+38 (099) 567 8901 0","+38 099 a0000000","+38 (0989) 567 8901","+48 (0989) 567 8901"];

console.log("Testing phone number validation");
for (const key in valideNumber ) {
  console.log(validatePhone(valideNumber [key]));
}

console.log("====================================");
for (const key in notValidNumber) {
    console.log(validatePhone(notValidNumber[key]));
  }


  let validatePassword = (password) =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/gm;
    return regex.test(password);
  }


  /// valide password
let validePassword= ["C00l_Pass", "SupperPas1"];

/// not valide  password
let notValidePassword = ["Cool_pass","C00l"];

console.log("Testing password validation");
for (const key in validePassword ) {
  console.log(validatePassword(validePassword[key]));
}

console.log("====================================");
for (const key in notValidePassword) {
    console.log(validatePassword(notValidePassword[key]));
  }

