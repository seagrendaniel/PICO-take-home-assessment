const fs = require('fs')

// Beers endpoint from random-data-api
const beersUrl = 'https://random-data-api.com/api/v2/beers';

const saveJSONToCurrentDirectory = (jsonData, fileName) => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const filePath = `${process.cwd()}/${fileName}`;
  fs.writeFileSync(filePath, jsonString);
  console.log(`JSON data saved to ${filePath}`);
}


// Get single beer from api
const getBeer = async () => {
  try {
    const response = await fetch("https://random-data-api.com/api/v2/beers")
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${beersUrl}`)
    }
    const beer = await response.json()
    return beer
  } catch(error) {
    console.error(error)
  }
}

const getValidBeers = async (list) => {
  const beerTypesToCheck = ["Ale", "Lager", "Stout"]
  // Have to wrap function in a Promise so that api call can work with setTimeout
  let second = 0
  return new Promise((resolve) => {
    setTimeout( async () => {
      while (list.length < 20) {
        try {
          let beer = await getBeer()
          if(beerTypesToCheck.some(type => beer.style.includes(type))) {
            // convert alcohol percentage to float to compare to 2.5% ABV requirement
            let abv = parseFloat(beer.alcohol.slice(0, -1))
            if(abv > 2.5) {
              list.push(beer)
            } else {
              throw new Error(`Bad beer: ${beer.name}`)
            }
          } 
        } catch (error) {
          console.error(error.message)
        }
      }
      console.log(list.length)
      resolve(list)
    }, 500)
  })
}


// Main function
const getAndWriteAllBeers = async () => {
  let beerList = []
  beersList = await getValidBeers(beerList)
  saveJSONToCurrentDirectory(beersList, "beers.json")
}

getAndWriteAllBeers()