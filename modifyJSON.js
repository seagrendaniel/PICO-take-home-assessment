const fs = require("fs")

const allBeersJSON = "./beers.json"

const readJSON =  () => {
  const file = fs.readFileSync(allBeersJSON, 'utf8')
  const fileObj = JSON.parse(file)
  return fileObj
}

const beersObj = readJSON()

const saveJSONToCurrentDirectory = (jsonData, fileName) => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const filePath = `${process.cwd()}/${fileName}`;
  fs.writeFileSync(filePath, jsonString);
  console.log(`JSON data saved to ${filePath}`);
}

const sortAlphabetically = (array) => {
  array = array.sort((a, b) => {
    let styleA = a.style.toUpperCase()
    let styleB = b.style.toUpperCase()

    if (styleA < styleB) {
      return -1
    }
    if (styleA > styleB) {
      return 1
    }
    return 0
  })
   return array
}

const filterBeers = (beerList) => {
  let alesList = []
  let stoutsList = []
  let lagersList = []

  beerList.forEach((beer) => {
    // Conversions for later comparisons
    beer.alcohol = parseFloat(beer.alcohol.slice(0, -1))
    beer.yeast = beer.yeast.split(" ")[0]
    if (beer.style.includes("Ale")) {
      alesList.push(beer)
    } else if (beer.style.includes("Stout")) {
      stoutsList.push(beer)
    } else {
      lagersList.push(beer)
    }
  })

  // Sort arrays alphabetically by style prop
  alesList = sortAlphabetically(alesList)
  stoutsList = sortAlphabetically(stoutsList)
  lagersList = sortAlphabetically(lagersList)

  let finalAle = {}
  let finalStout = {}
  let finalLager = {}

  for (let i=0; i < alesList.length; i++) {
    if (alesList[i+1]) {
      let style1 = alesList[i].style.split(' ')
      let style2 = alesList[i+1].style.split(' ')
      if (style1.length < style2.length) {
        finalAle.name = alesList[i+1].style
      } else {
        finalAle.name = alesList[i].style
      }
    }
  }

  for (let i=0; i < stoutsList.length; i++) {
    if (stoutsList[i+1]) {
      let style1 = stoutsList[i].style.split(' ')
      let style2 = stoutsList[i+1].style.split(' ')
      if (style1.length < style2.length) {
        finalStout.name = stoutsList[i+1].style
      } else {
        finalStout.name = stoutsList[i].style
      }
    }
  }

  for (let i=0; i < lagersList.length; i++) {
    if (lagersList[i+1]) {
      let style1 = lagersList[i].style.split(' ')
      let style2 = lagersList[i+1].style.split(' ')
      if (style1.length < style2.length) {
        finalLager.name = lagersList[i+1].style
      } else {
        finalLager.name = lagersList[i].style
      }
    }
  }
  
  finalAle.alcohol = 0
  finalStout.alcohol = 0
  finalLager.alcohol = 0
  
  alesList.forEach((beer) => { return finalAle.alcohol += beer.alcohol})
  stoutsList.forEach((beer) => { return finalStout.alcohol += beer.alcohol})
  lagersList.forEach((beer) => { return finalLager.alcohol += beer.alcohol})
  
  finalAle.alcohol = finalAle.alcohol.toFixed(1)
  finalStout.alcohol = finalStout.alcohol.toFixed(1)
  finalLager.alcohol = finalLager.alcohol.toFixed(1)

  let aleYeastArr = []
  let stoutYeastArr = []
  let lagerYeastArr = []

  alesList.forEach(beer => aleYeastArr.push(beer.yeast))
  stoutsList.forEach(beer => stoutYeastArr.push(beer.yeast))
  lagersList.forEach(beer => lagerYeastArr.push(beer.yeast))

  aleYeastArr = aleYeastArr.sort()
  stoutYeastArr = stoutYeastArr.sort()
  lagerYeastArr = lagerYeastArr.sort()


  finalAle.yeast = aleYeastArr.join(" - ")
  finalStout.yeast = stoutYeastArr.join(" - ")
  finalLager.yeast = lagerYeastArr.join(" - ")


  if (finalAle.alcohol > finalStout.alcohol && finalAle.alcohol > finalLager.alcohol) {
    finalAle.isStrongest = true
    finalStout.isStrongest = false
    finalLager.isStrongest = false
  } else if (finalStout.alcohol > finalAle.alcohol && finalStout.alcohol > finalLager.alcohol) {
    finalAle.isStrongest = false
    finalStout.isStrongest = true
    finalLager.isStrongest = false
  } else if (finalLager.alcohol > finalAle.alcohol && finalLager.alcohol > finalStout.alcohol) {
    finalAle.isStrongest = false
    finalStout.isStrongest = false
    finalLager.isStrongest = true
  }

  let finalBeers = [finalAle, finalStout, finalLager]

  return finalBeers
}

saveJSONToCurrentDirectory(filterBeers(beersObj), "filteredBeers.json")
