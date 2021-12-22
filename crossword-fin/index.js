


body = document.getElementById("body")


let testStr = '<div class="outer-box"><input class="box letter" value="t" maxlength="1" size="1"/></div><div class="outer-box"><input class="box letter" value="t" maxlength="1" size="1" /></div><div class="outer-box"></div>'

function square(letter, address, number) {
  let str = ""
  if (letter !== "") {
    if (letter === "*") {
      let index = `<p class="index" id="i${address}">${number}</p>`
      str = index+`<input class="box letter" name="${address}" id="${address}" maxlength="1" size="1" />`
    } else {
      let index = `<p class="index" id="i${address}">${number}</p>`
      str = index+`<input class="box letter" name="${address}" id="${address}" value="${letter}" maxlength="1" size="1" />`
    }
  }
  return `<div class="outer-box">${str}</div>`
}


// Add words

const wordDict = {
  "***p*a*": {X: 3, Y: 2, Direction: "d", number: 1},
  "***e****t***" : {X: 13, Y: 1, Direction: "d", number: 3},
  "*o***" : {X: 11, Y:10, Direction: "d", number: 8},
  "******" : {X: 7, Y:2, Direction: "d", number: 2},
  "me**********g**d*" : {X: 17, Y:1, Direction: "d", number: 4},
  "***l*n*" : {X: 1, Y:7, Direction: "d", number: 6},

  "*****" : {X: 1, Y: 3, Direction: "r", number: 1},
  "**********e*t" : {X: 7, Y: 2, Direction: "r", number: 2},
  "**h**x" : {X: 2, Y: 5, Direction: "r", number: 4},
  "**a**e*" : {X: 1, Y:7, Direction: "r", number: 6},
  "a*e***c" : {X: 11, Y:4, Direction: "r", number: 3},
  "****v****o" : {X: 15, Y:6, Direction: "r", number: 5},
  "c****rs*******m" : {X: 12, Y:8, Direction: "r", number: 7},
  "*a*a" : {X: 11, Y:10, Direction: "r", number: 8},
  "******s" : {X: 8, Y:12, Direction: "r", number: 9},
  "g*o**" : {X: 17, Y:13, Direction: "r", number: 10},

  "t**dv****" : {X: 19, Y: 2, Direction: "d", number: 5},
}

function getAnswerLetters(posX, posY, direction, length) {
    let word = ""
    let x=0
    let y=0
    for (i=0; i<length; i++) {
        if (direction==="r") {
            x = i
        } else if (direction==="d") {
            y = i
        }
        const letter = document.getElementById(`${parseInt(posX) + x}*${parseInt(posY) + y}`).value
        word = word + letter
    }
    return word
}

function getAnswerDict(wordDict) {
  const ans = {}
  for (let item in wordDict) {
    console.log(item)
    const wordObj = wordDict[item]
    const posX = wordObj["X"]
    const posY = wordObj["Y"]
    const direction = wordObj["Direction"]
    const word = getAnswerLetters(posX, posY, direction, item.length)
    ans[`${posX}*${posY}*${direction}`] = word
  }
  return ans
}

function getLetters(wordDict) {
  const ans = {}
  for (let item in wordDict) {
    const wordObj = wordDict[item]
    const number = wordObj["number"]
    for (let i=0; i<item.length; i++) {
      const obj = {}
      if (i===0) {
        obj["number"] = number
      } else {
        obj["number"] = ""
      }
      obj["letter"] = item[i]
      if (wordObj["Direction"] === "d") {
        ans[`${wordObj["X"]}*${wordObj["Y"] + i}`] = obj
      } else {
        ans[`${wordObj["X"] + i}*${wordObj["Y"]}`] = obj
      }
    }
  }
  return ans
}

// Define grid


function layoutGrid(wordDict) {
  let letterDict = getLetters(wordDict)
  let str = ""
  for (let j=0; j<21; j++) {
    let row = ""
    for (let i=0; i<30; i++) {
        const address = `${i}*${j}`
        let value = ""
        let number = 10
        if (letterDict[address] !== undefined) {
          value = letterDict[address]["letter"]
          number = letterDict[address]["number"]
        }
        row = row + square(value, address, number)
    }
    str = str + `<div class="row">${row}</div>`
  }

  return str
}

testStr = layoutGrid(wordDict)
document.getElementById("content").innerHTML = testStr + document.getElementById("content").innerHTML





// Determine answers
function parsePos(position) {
  let str1 = ""
  let str2 = ""
  let str3 = ""
  let i = 0
  while (position[i] !== "*") {
    str1 = str1 + position[i]
    i++
  }
  i++
  while (position[i] !== "*") {
    str2 = str2 + position[i]
    i++
  }
  i++
  while (i<position.length) {
    str3 = str3 + position[i]
    i++
  }
  return [parseInt(str1), parseInt(str2), str3]
}

function traverseWord(startX, startY, direction, step) {
  if (direction === "d") {
    return `${startX}*${startY + step}`
  } else {
    return `${startX + step}*${startY}`
  }
}




function parseAnswers(submittedAnswersDict, letterDict) {
  let ansDict = {}
  for (let item in submittedAnswersDict) {
    let str = ""
    let i=0
    let arr = parsePos(item)
    let currentPos = traverseWord(arr[0], arr[1], arr[2], i)
    while (letterDict[currentPos] !== undefined) {
      console.log("POP")
      str =  str + letterDict[currentPos]
      i++
      currentPos = traverseWord(arr[0], arr[1], arr[2], i)
    }
    ansDict[item] = str
  }
  return ansDict
}

function defineWordDict(wordDict, letterDict) {
}




// Check answers

function checkAnswers(submittedAnswersDict) {
  let str = ""
  console.log(submittedAnswersDict)
  for (item in submittedAnswersDict) {
    str = str + submittedAnswersDict[item]
  }
  return (str)
}






function hashingFunc(string) {
  let ans = 1
  for (item in string) {
    num = string[item].charCodeAt(0)%64
    if (ans > 100000000000000000) {
      ans = Math.ceil(ans/12344)
    }
    ans = num*ans
  }
  return ans
}


// Submit

function myFunction() {
  console.log(hashingFunc(checkAnswers(getAnswerDict(wordDict))))
}