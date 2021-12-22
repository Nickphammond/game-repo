var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
const pixelSize = 4
const canvasWidth = 800
const canvasHeight = 600
const squares = {}

// Fill in canvas

function canvasTile(posX, posY, pixelSize, color) {
  ctx.fillStyle = color
  ctx.fillRect(posX, posY, pixelSize, pixelSize)
}

function mouseDown(event) {
  const posX = parseInt(event.offsetX/pixelSize)
  const posY = parseInt(event.offsetY/pixelSize)
  const address = `${posX}*${posY}`
  let color = document.getElementById("color1").value;
  let brushSize
  squares[address] = color
  squares["2*2"] = color
  canvasTile(posX*pixelSize, posY*pixelSize, pixelSize, color)
  c.addEventListener("mousemove", moveDraw)
}

function moveDraw(event) {
  c.addEventListener("mouseup", mouseUp)
  const posX = parseInt(event.offsetX/pixelSize)
  const posY = parseInt(event.offsetY/pixelSize)
  const address = `${posX}*${posY}`
  let color = document.getElementById("color1").value;
  let brushSize
  squares[address] = color
  canvasTile(posX*pixelSize, posY*pixelSize, pixelSize, color)
}

function mouseUp() {
  c.removeEventListener("mousemove",  moveDraw);
}

c.addEventListener("mousedown", mouseDown)

// Instruction index
let instructionIndex = 0

// Langdon's ant
let orient = 0

const position = {
  X: 100,
  Y: 50
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
      canvasTile(x*4, y*4, pixelSize, squares[x + "*" + y])
    } else {
      canvasTile(x*4, y*4, pixelSize, "LightGrey")
    }
  }
}

async function updateColor (instructionDic, position, numberOfSteps, pixelSize) {
  let thing
  thing = instructions(position, orient, instructionDic)
  canvasTile(position["X"]*pixelSize , position["Y"]*pixelSize, pixelSize, squares[position["X"] + "*" + position["Y"]])
  for (let i=0; i<numberOfSteps; i++) {
    let x = thing["position"]['X']
    let y = thing["position"]['Y']
    // await new Promise(r => setTimeout(r, 1));
    thing = instructions(thing["position"], thing["orientation"], instructionDic)
    canvasTile(x*4 , y*4, pixelSize, squares[x + "*" + y])
  }
}

// Buttons and stuff

function defaultSelectionContainer() {
  const str = 
  `
  <div id="selectionContainer0">
    <select id="direction0">
      <option value="left" selected="selected"> left
      </option>
      <option value="right"> right
      </option>
    </select>
    <input id="color0" type="color">
  </div>
  `
  return str
}

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
    <button onclick="removeRule(${num})">Remove</button>
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

function getNewMaxId() {
  const selectionBox = document.getElementById("selectionBox")
  const list = getValuesOfSelectionBox()
  let ansId = 0
  console.log(list[0])
  for (let i=0; i<list.length; i++) {
    if (list[i]["id"] > ansId) {
      ansId = list[i]["id"]
    }
  }
  return parseInt(ansId) + 1
}

function addRule() {
  const newID = getNewMaxId()
  const selectionBox = document.getElementById("selectionBox")
  const list = getValuesOfSelectionBox()
  selectionBox.innerHTML =  selectionBox.innerHTML + selectionContainer(newID, "#000000", "left")
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

function removeRule(idToDestroy) {
  console.log(idToDestroy)
  const selectionBox = document.getElementById("selectionBox")
  const list = getValuesOfSelectionBox()
  let htmlString = ""
  for (let i=0; i<list.length; i++) {
    const id = list[i]["id"]
    if (parseInt(idToDestroy)!==parseInt(id) && 0!==parseInt(id)) {
      const color = list[i]["color"]
      const turn = list[i]["turn"]
      htmlString = htmlString + selectionContainer(id, color, turn)
    }
  }
  selectionBox.innerHTML = defaultSelectionContainer() + htmlString
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
  updateColor(obj, getPosition(), 11000, pixelSize)
}

// Conway Game of Life
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
  let currentColor=""
  let aliveCount = 0
  let newColor = ""
  const neighbourList = getNeighbours(address)
  if (squares[address]===undefined) {
    for (item in neighbourList) {
      const neighbour = neighbourList[item]
      if (squares[neighbour]!==undefined) {
        currentColor=squares[neighbour]
      }
    }
  }
  for (item in neighbourList) {
    const neighbour = neighbourList[item]
    if (squares[neighbour]!==undefined && (squares[neighbour]===currentColor || squares[neighbour]===squares[address] )) {
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

function conwayStep(canvasWidth, canvasHeight, pixelSize, squares) {
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
    if (squares[address]==="#000000") {
      console.log(squares[address])
      console.log(address)
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
      canvasTile(x*pixelSize, y*pixelSize, pixelSize, "LightGrey")
    } else {
      canvasTile(x*pixelSize, y*pixelSize, pixelSize, updatedObj[address])
    }
  }
  return
}

function play2() {
  conwayStep(canvasWidth, canvasHeight, pixelSize, squares)
}

// Run

antBoard(canvasWidth, canvasHeight, pixelSize)