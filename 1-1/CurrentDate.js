let currentDate = function(){
    let year = new Date();
    let month = new Date().getMonth();
    let days = new Date().getDay();
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    return year+"-"+month+"-"+days+" "+hours+":"+minutes+":"+seconds;
}

module.exports = currentDate();
