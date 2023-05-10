const { rejects } = require("assert");
const fs = require("fs");

function readCsv(filePath) {
  const TOP10 = 10;
  let data = fs.readFileSync(filePath, "utf-8");
  const regex = /^(\d+\.\d+,\d+\.\d+),((?<=,)[^,#\n]+),(?<=,)\d+(?=,)/;
  const rows = data
    .trim()
    .split("\n")
    .filter((row) => regex.test(row))
    .map((item) => {
      const arr = item.split(",");

      return {
        x: arr[0],
        y: arr[1],
        name: arr[2],
        population: arr[3],
      };
    })
    .sort((a, b) => b.population - a.population)
    .slice(0, TOP10)
    .reduce((accum, current, index) => {
      accum[current.name] = { population: current.population, rating: ++index };
      return accum;
    }, {});

  return (someThing) => {
    const currentCityKey = Object.keys(rows).find((city) =>
      someThing.includes(city)
    );

    const currentCity = currentCityKey;
    const data = rows[currentCity];

    const newString = `${currentCity} (${data.rating} місце в ТОП - 10 самих великх міст України з населенням ${currentCity.population} чоловік)`;
    return someThing.replace(currentCityKey, newString);
  };
}

const csvFile = readCsv("./text.csv");
console.log(csvFile("Алушта курорти в Україні"));
