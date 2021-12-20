var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const pixelSize = 4
const canvasWidth = 800
const canvasHeight = 600

function canvasTile(posX, posY, color) {
  ctx.fillStyle = color
  ctx.fillRect(posX, posY, pixelSize, pixelSize)
}

// Fill in canvas
function testCanvas() {
  let x = 0
  let y = 0
  for (let i=0; i<90000; i++) {
    if (i%800 === 0) {
      x = 0
      y++
    } else {
      x++
    }
    canvasTile(x*pixelSize, y*pixelSize)
  }
}

const instructionDic = {
  white: {
    turn: "right",
    next: "red"
  },
  red: {
    turn: "right",
    next: "green"
  },
  green: {
    turn: "right",
    next: "cyan"
  },
  cyan: {
    turn: "left",
    next: "yellow"
  },
  yellow: {
    turn: "right",
    next: "white"
  }
}

// Instruction index
let instructionIndex = 0

// Langdon's ant
let orient = 0

const position = {
  X: 100,
  Y: 50
}

const squares = {
  // "99*100": "#CD5C5C",
  "100*98": "#CD5C5C",
  "100*99": "#CD5C5C",
  "100*100": "#CD5C5C",
  "101*100": "#CD5C5C",
  "102*99": "#CD5C5C"
}


function turnRight(position, orientation) {
  const newPosition = {}
  const newOrientation = (orientation + 1)%4
  newPosition["X"] = position["X"] + -1*(newOrientation - 2)%2  
  newPosition["Y"] = position["Y"] + 1*(newOrientation - 1)%2

  return {
    position: newPosition,
    orientation: newOrientation
  }
}

function turnLeft(position, orientation) {
  const newPosition = {}
  const newOrientation = (orientation + 3)%4
  newPosition["X"] = position["X"] + -1*(newOrientation - 2)%2 
  newPosition["Y"] = position["Y"] + 1*(newOrientation - 1)%2
  return {
    position: newPosition,
    orientation: newOrientation
  }
}

function turnLeftOrRight(position, orientation, turn) {
  if (turn === "left") {
    return turnLeft(position, orientation) 
  } else if (turn === "right") {
    return turnRight(position, orientation)
  }
}


function instructions(position, orientation, instructionDic) {
  let positionStr = position["X"] + "*" + position["Y"]
  const ans = {}
  if (squares[positionStr] !== undefined) {
    let nextColor
    const currentColor = squares[positionStr]
    if (instructionDic[currentColor] !== undefined) {
      nextColor = instructionDic[currentColor]["next"]
    } else {
      let color
      let firstLoop = true
      for (item in instructionDic) {
        if (firstLoop) {
          color = item
          firstLoop = false
        } else if (instructionDic[item]["id"] === 0) {
          color = item
        }
      }
      nextColor = color
    }
    squares[positionStr] = nextColor
    const turn = instructionDic[nextColor]["turn"]
    const posThing = turnLeftOrRight(position, orientation, turn)
    ans["position"] = posThing["position"]
    ans["orientation"] = posThing["orientation"]

  } else {
    let color
    let firstLoop = true
    for (item in instructionDic) {
      if (firstLoop) {
        color = item
        firstLoop = false
      } else if (instructionDic[item]["id"] === 0) {
        color = item
      }
    }
    const turn = instructionDic[color]["turn"]
    squares[positionStr] = color
    const posThing = turnLeftOrRight(position, orientation, turn) 
    ans["position"] = posThing["position"]
    ans["orientation"] = posThing["orientation"]
  }
      
  return ans
}



function antBoard(canvasWidth, canvasHeight, pixelSize) {
  const width = parseInt(canvasWidth/pixelSize)
  const height = parseInt(canvasHeight/pixelSize)
  const total = width*height
  let x = 0
  let y = 0
  for (let i=0; i<total; i++) {
    if (i%width === 0) {
      x = 0
      y++
    } else {
      x++
    }
    if (squares[x + "*" + y] !== undefined) {
      canvasTile(x*4, y*4, squares[x + "*" + y])
    } else {
      canvasTile(x*4, y*4, "LightGrey")
    }
  }
}

antBoard(800, 600, 4)

async function updateColor (instructionDic, position, numberOfSteps) {
  let thing
  thing = instructions(position, orient, instructionDic)
  canvasTile(position["X"]*pixelSize , position["Y"]*pixelSize, squares[position["X"] + "*" + position["Y"]])
  for (let i=0; i<numberOfSteps; i++) {
    let x = thing["position"]['X']
    let y = thing["position"]['Y']
    // await new Promise(r => setTimeout(r, 1));
    thing = instructions(thing["position"], thing["orientation"], instructionDic)
    canvasTile(x*4 , y*4, squares[x + "*" + y])
  }
}


// Buttons and stuff

function selectionContainer(num, color, turn) {
  let Leftstr
  let Rightstr
  if (turn === "left") {
    Leftstr = 'selected="selected"'
    Rightstr = ''
  } else {
    Leftstr = ''
    Rightstr = 'selected="selected"'
  }

  let str = 
  `
  <div id="selectionContainer${num}">
    <select id="direction${num}">
      <option value="left" ${Leftstr}> left
      </option>
      <option value="right" ${Rightstr}> right
      </option>
    </select>
    <input id="color${num}" value="${color}" type="color">
  </div>

  `
  return str
}

function getIdFromString(str){
  const prefixLength = "selectionContainer".length
  return str.substr(prefixLength, str.length - prefixLength)
}

function getColor(num) {
  let colorInputBox = document.getElementById(`color${num}`)
  return colorInputBox.value
}

function getDirection(num) {
  let directionInputBox = document.getElementById(`direction${num}`)
  return directionInputBox.value
}

function getValuesOfSelectionBox() {
  const selectionBoxList = document.getElementById("selectionBox").children
  const len = selectionBoxList.length
  const answerArray = []
  for (let i=0; i<selectionBoxList.length; i++) {
    let id = getIdFromString(selectionBoxList[i].id)
    answerArray.push({id: id, color: getColor(id), turn: getDirection(id)})
  }
  return answerArray
}

function getPosition() {
  const posX = document.getElementById("positionX").value
  const posY = document.getElementById("positionY").value
  return {X: parseInt(posX), Y: parseInt(posY)}
}

function addRule() {
  const selectionBox = document.getElementById("selectionBox")
  const len = selectionBox.children.length
  const list = getValuesOfSelectionBox()
  selectionBox.innerHTML =  selectionBox.innerHTML + selectionContainer(len, "#000000", "left")
  for (let i=0; i<list.length; i++) {
    const id = list[i]["id"]
    const color = list[i]["color"]
    const turn = list[i]["turn"]
    const colorSection = document.getElementById(`color${id}`)
    const directionSection = document.getElementById(`direction${id}`)
    colorSection.setAttribute("value", color)
    directionSection.setAttribute("value", turn)
  }
}

function addInstruction(num, object, selectionBox) {
  const len = selectionBox.length
  object[getColor(num)] = {turn: getDirection(num), next: getColor((parseInt(num)+1)%len), id: num}
  return object
}

function play() {
  const obj = {}
  const selectionBox = document.getElementById("selectionBox").children;
  for (let i=0; i<selectionBox.length; i++) {
    let str = selectionBox[i].id
    let id = getIdFromString(str)
    addInstruction(id, obj, selectionBox)
  }
  updateColor(obj, getPosition(), 11000)
}

function getX(address) {
  let string = ""
  for (i=0; address[i]!=="*"; i++) {
    string = string + address[i]
  }
  return parseInt(string)
}

function getY(address) {
  let string = ""
  let postStar = false
  for (i=0; i<address.length; i++) {
    if (postStar) {
      string = string + address[i]
    }
    if (address[i]==="*") {
      postStar = true
    }
  }
  return parseInt(string)
}

function getNeighbours(address) {
  const answerArray = []
  const posX = getX(address)
  const posY = getY(address)
  let neighbourX = posX-1
  let neighbourY = posY-1
  for (let i=0; i<3; i++) {
    neighbourY = posY-1
    for (let j=0; j<3; j++) {
      if (`${neighbourX}*${neighbourY}` !== address) {
        answerArray.push(`${neighbourX}*${neighbourY}`)
      }
      neighbourY++
    }
    neighbourX++
  }
  return answerArray
}

function queryAlive(address, squares) {
  let aliveCount = 0
  let newColor = ""
  const neighbourList = getNeighbours(address)
  for (item in neighbourList) {
    const neighbour = neighbourList[item]
    if (squares[neighbour]!==undefined) {
      newColor = squares[neighbour]
      aliveCount++
    }
  }
  if (squares[address]===undefined) {
    if (aliveCount===3) {
      return newColor
    } else {
      return ""
    }
  } else {
    if (aliveCount===2 || aliveCount===3) {
      return squares[address]
    } else {
      return ""
    }
  }
}

console.log(queryAlive("100*99", squares))

function conwayStep(canvasWidth, canvasHeight, pixelSize) {
  const width = parseInt(canvasWidth/pixelSize)
  const height = parseInt(canvasHeight/pixelSize)
  const total = width*height
  const updatedObj = {}
  let x = 0
  let y = 0
  for (let i=0; i<total; i++) {
    if (i%width === 0) {
      x = 0
      y++
    } else {
      x++
    }
    const address = x + "*" + y
    if (queryAlive(address, squares)==="") {
      updatedObj[address] = undefined
    } else {
      updatedObj[address] = queryAlive(address, squares)
    }
  }
  x = 0
  y = 0
  for (let i=0; i<total; i++) {
    if (i%width === 0) {
      x = 0
      y++
    } else {
      x++
    }
    const address = x + "*" + y
    squares[address] = updatedObj[address]
    if (updatedObj[address]===undefined) {
      canvasTile(x*pixelSize, y*pixelSize, "LightGrey")
    } else {
      canvasTile(x*pixelSize, y*pixelSize, updatedObj[address])
    }
  }
  return
}

function play2() {
  conwayStep(canvasWidth, canvasHeight, pixelSize) 
}