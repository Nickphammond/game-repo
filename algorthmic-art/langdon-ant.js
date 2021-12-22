const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
c.addEventListener("mousedown", mouseDown)
const pixelSize = 4
const canvasWidth = 800
const canvasHeight = 600
const squares = {}

// Fill in canvas

function canvasTile(posX, posY, pixelSize, color) {
  ctx.fillStyle = color
  ctx.fillRect(posX, posY, pixelSize, pixelSize)
}

function brushWidth(brushRadius, extent) {
  if (brushRadius**2 - extent**2 > 0) {
    return Math.floor(Math.sqrt(brushRadius**2 - extent**2))
  } else {
    return 0
  }
}

function brush(posX, posY, pixelSize, brushSize, color) {
  const brushRadius = Math.ceil(brushSize/2)
  for (let i=0; i<=brushRadius; i++) {
    const tempXL = (posX - i)
    const tempXR = (posX + i)
    const width = brushWidth(brushRadius, i)
    for (let j=0; j<width; j++) {
      const tempYD = (posY - j)
      const tempYU = (posY + j)

      const address1 = `${tempXL}*${tempYD}`
      canvasTile(tempXL*pixelSize, tempYD*pixelSize, pixelSize, color)
      squares[address1] = color

      const address2 = `${tempXL}*${tempYD}`
      canvasTile(tempXL*pixelSize, tempYU*pixelSize, pixelSize, color)
      squares[address2] = color

      const address3 = `${tempXL}*${tempYD}`
      canvasTile(tempXR*pixelSize, tempYD*pixelSize, pixelSize, color)
      squares[address3] = color

      const address4 = `${tempXL}*${tempYD}`
      canvasTile(tempXR*pixelSize, tempYU*pixelSize, pixelSize, color)
      squares[address4] = color
    }
  }
}

function mouseDown(event) {
  const posX = parseInt(event.offsetX/pixelSize)
  const posY = parseInt(event.offsetY/pixelSize)
  const address = `${posX}*${posY}`
  let color = document.getElementById("color1").value
  let brushSize = document.getElementById("brush-size").value
  brush(posX, posY, pixelSize, brushSize, color)
  c.addEventListener("mousemove", moveDraw)
}

function moveDraw(event) {
  c.addEventListener("mouseup", mouseUp)
  const posX = parseInt(event.offsetX/pixelSize)
  const posY = parseInt(event.offsetY/pixelSize)
  const address = `${posX}*${posY}`
  let color = document.getElementById("color1").value;
  let brushSize = document.getElementById("brush-size").value
  brush(posX, posY, pixelSize, brushSize, color)
}

function mouseUp() {
  c.removeEventListener("mousemove",  moveDraw);
}


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

function defaultSelectionContainer(id) {
  let removeButton = ""
  if (parseInt(id) !== 0) {
    removeButton = `<button onclick="removeRule(${id})">Remove</button>`
  }
  const str = 
  `
  <div id="selectionContainer${id}">
    <select id="direction${id}">
      <option value="left" selected="selected"> left
      </option>
      <option value="right"> right
      </option>
    </select>
    <input id="color${id}" type="color">
    ${removeButton}
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
  let removeButton = ""
  let colorValue = `value="${color}"`
  if (parseInt(num) !== 0) {
    removeButton = `<button onclick="removeRule(${num})">Remove</button>`
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
    <input id="color${num}" ${colorValue} type="color">
    ${removeButton}
  </div>
  `
  return str
}

function getIdFromString(str){
  const prefixLength = "selectionContainer".length
  return parseInt(str.substr(prefixLength, str.length - prefixLength))
}

function getColor(num) {
  const colorInputBox = document.getElementById(`color${num}`)
  return colorInputBox.value
}

function getDirection(num) {
  const directionInputBox = document.getElementById(`direction${num}`)
  return directionInputBox.value
}

function getValuesOfSelectionBox() {
  const selectionBoxList = document.getElementById("selectionBox").children
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

function getNumberOfSteps() {
  return document.getElementById("steps-number").value;
}

function getNewMaxId() {
  const selectionBox = document.getElementById("selectionBox")
  const list = getValuesOfSelectionBox()
  let ansId = 0
  for (let i=0; i<list.length; i++) {
    if (list[i]["id"] > ansId) {
      ansId = list[i]["id"]
    }
  }
  return parseInt(ansId) + 1
}

function addRule() {
  let newID = getNewMaxId()
  if (newID===1) {
    newID = 2
  }
  const selectionBox = document.getElementById("selectionBox")
  const list = getValuesOfSelectionBox()
  let htmlString = ""
  for (let i=0; i<list.length; i++) {
    const id = list[i]["id"]
    const color = list[i]["color"]
    const turn = list[i]["turn"]
    htmlString = htmlString + selectionContainer(id, color, turn)
  }
  selectionBox.innerHTML = htmlString + defaultSelectionContainer(newID)
}

function removeRule(idToDestroy) {
  const selectionBox = document.getElementById("selectionBox")
  const list = getValuesOfSelectionBox()
  let htmlString = ""
  for (let i=0; i<list.length; i++) {
    const id = list[i]["id"]
    if (parseInt(idToDestroy)!==parseInt(id)) {
      const color = list[i]["color"]
      const turn = list[i]["turn"]
      htmlString = htmlString + selectionContainer(id, color, turn)
    }
  }
  selectionBox.innerHTML = htmlString
}

function nextInstructionId(id){
  const selectionBox = document.getElementById("selectionBox").children;
  let maxId = id
  for (let i=0; i<selectionBox.length; i++) {
    const str = selectionBox[i].id
    const tempId = getIdFromString(str)
    if (tempId>maxId) {
      maxId = tempId
    }
  }
  let nextId = maxId
  for (let i=0; i<selectionBox.length; i++) {
    const str = selectionBox[i].id
    const tempId = getIdFromString(str)
    if (tempId<nextId && tempId>id) {
      nextId = tempId
    }
  }
  if (maxId === id) {
    nextId = 0
  }
  return nextId
}

function addInstruction(num, object, selectionBox) {
  object[getColor(num)] = {turn: getDirection(num), next: getColor(nextInstructionId(num)), id: num}
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
  updateColor(obj, getPosition(), getNumberOfSteps(), pixelSize)
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