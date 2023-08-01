'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const FOOD = 'FOOD'
const EMPTY = ' '
const CHERRY = 'CHERRY'
const SUPER_FOOD = 'SUPER_FOOD'

const FOOD_IMG = '<img src="img/food.png">'
const CHERRY_IMG = '<img src="img/cherry.png">'
const SUPER_FOOD_IMG = '<img class="super_food" src="img/superfood.png">'

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
let gCherryInterval;

function onInit() {
    gBoard = buildBoard()
    resetGame()
    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)

    gGame.isOn = true

    gIntervalGhosts = setInterval(moveGhosts, 1000)
    gCherryInterval = setInterval(addCherry, 15000)
    playSound('intro-music')
}

function buildBoard() {
    const size = 12
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = { type: FLOOR, gameElement: FOOD }
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j].type = WALL
                board[i][j].gameElement = null
            }
            if (i === 1 && j === 1 ||
                i === 1 && j === size - 2 ||
                i === size - 2 && j === 1 ||
                i === size - 2 && j === size - 2) board[i][j].gameElement = SUPER_FOOD
        }
    }
    customBoard(board)
    return board
}

function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'
            strHTML += `<td class="cell ${cellClass}">\n`

            if (currCell.gameElement === PACMAN) strHTML += PACMAN_IMG
            if (currCell.gameElement === FOOD) strHTML += FOOD_IMG
            if (currCell.gameElement === SUPER_FOOD) strHTML += SUPER_FOOD_IMG
            if (currCell.gameElement === CHERRY) strHTML += CHERRY_IMG

            if (gPacman.isSuper) {
                if (currCell.gameElement === GHOST) strHTML += currCell.options.edible
            } else {
                if (currCell.gameElement === GHOST) strHTML += currCell.options.img
            }
            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('.score').innerText = gGame.score
}

function gameOver() {
    playSound('death')
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    renderCell(gPacman.location, '<img src="img/grave.png">')
    gGame.isOn = false
}

function customBoard(board) {
    board[3][2].type = WALL
    board[3][2].gameElement = null
    board[3][3].type = WALL
    board[3][3].gameElement = null
    board[3][4].type = WALL
    board[3][4].gameElement = null
    board[6][6].type = WALL
    board[6][6].gameElement = null
    board[6][5].type = WALL
    board[6][5].gameElement = null
    // board[2][6].type = WALL
    // board[2][6].gameElement = null
    // board[3][6].type = WALL
    // board[3][6].gameElement = null
}

