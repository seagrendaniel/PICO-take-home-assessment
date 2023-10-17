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
  let finalBeers

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

  let finalAle = {}
  let finalStout = {}
  let finalLager = {}


  // Make sure there are ales in the initial beers.json
  if(alesList.length) { 
    alesList = sortAlphabetically(alesList)

    // Initialize names for length check
    finalAle.name = alesList[0].style

    for (let i=0; i < alesList.length; i++) {
      if (alesList[i+1]) {
        let style1 = alesList[i].style.split(' ')
        let style2 = alesList[i+1].style.split(' ')
  
        if (style1.length < style2.length && style2.length > finalAle.name.split(' ').length) {
          finalAle.name = alesList[i+1].style
        } else if (style1.length > style2.length && style1.length > finalAle.name.split(' ').length) {
          finalAle.name = alesList[i].style
        }
      }
    }

    finalAle.alcohol = 0
    alesList.forEach((beer) => { return finalAle.alcohol += beer.alcohol})
    finalAle.alcohol = finalAle.alcohol.toFixed(1)

    let aleYeastArr = []
    alesList.forEach(beer => aleYeastArr.push(beer.yeast))
    aleYeastArr = aleYeastArr.sort()
    finalAle.yeast = aleYeastArr.join(" - ")
  }

  // Make sure there are stouts in the initial beers.json
  if(stoutsList.length) {
    stoutsList = sortAlphabetically(stoutsList)

    // Initialize names for length check
    finalStout.name = stoutsList[0].style

    for (let i=0; i < stoutsList.length; i++) {
      if (stoutsList[i+1]) {
        let style1 = stoutsList[i].style.split(' ')
        let style2 = stoutsList[i+1].style.split(' ')
        if (style1.length < style2.length && style2.length > finalStout.name.split(' ').length) {
          finalStout.name = stoutsList[i+1].style
        } else if (style1.length > style2.length && style1.length > finalStout.name.split(' ').length) {
          finalStout.name = stoutsList[i].style
        }
      }
    }

    finalStout.alcohol = 0
    stoutsList.forEach((beer) => { return finalStout.alcohol += beer.alcohol})
    finalStout.alcohol = finalStout.alcohol.toFixed(1)

    let stoutYeastArr = []
    stoutsList.forEach(beer => stoutYeastArr.push(beer.yeast))
    stoutYeastArr = stoutYeastArr.sort()
    finalStout.yeast = stoutYeastArr.join(" - ")



  }

  // Make sure there are lagers in the initial beers.json
  if(lagersList.length) {
    lagersList = sortAlphabetically(lagersList)
  
    // Initialize names for length check
    finalLager.name = lagersList[0].style
  
    for (let i=0; i < lagersList.length; i++) {
      if (lagersList[i+1]) {
        let style1 = lagersList[i].style.split(' ')
        let style2 = lagersList[i+1].style.split(' ')
        if (style1.length < style2.length && style2.length > finalLager.name.split(' ').length) {
          finalLager.name = lagersList[i+1].style
        } else if (style1.length > style2.length && style1.length > finalLager.name.split(' ').length) {
          finalLager.name = lagersList[i].style
        }
      }
    }
    
  
    finalLager.alcohol = 0
    lagersList.forEach((beer) => { return finalLager.alcohol += beer.alcohol})
    finalLager.alcohol = finalLager.alcohol.toFixed(1)
  
    let lagerYeastArr = []
    lagersList.forEach(beer => lagerYeastArr.push(beer.yeast))
    lagerYeastArr = lagerYeastArr.sort()
    finalLager.yeast = lagerYeastArr.join(" - ")
  }

  if (finalAle && finalStout && finalLager) {
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
    finalBeers = [finalAle, finalStout, finalLager]

  } else if (finalAle && finalStout) {
    if (finalAle.alcohol > finalStout.alcohol) {
      finalAle.isStrongest = true
      finalStout.isStrongest = false
    } else {
      finalAle.isStrongest = false
      finalStout.isStrongest = true
    }
    finalBeers = [finalAle, finalStout]
  } else if (finalAle && finalLager) {
    if (finalAle.alcohol > finalLager.alcohol) {
      finalAle.isStrongest = true
      finalLager.isStrongest = false
    } else {
      finalAle.isStrongest = false
      finalLager.isStrongest = true
    }
    finalBeers = [finalAle, finalLager]
  } else if (finalStout && finalLager) {
    if (finalStout.alcohol > finalLager.alcohol) {
      finalStout.isStrongest = true
      finalLager.isStrongest = false
    } else {
      finalStout.isStrongest = false
      finalLager.isStrongest = true
    }
    finalBeers = [finalStout, finalLager]
  }

  return finalBeers
}

saveJSONToCurrentDirectory(filterBeers(beersObj), "filteredBeers.json")
