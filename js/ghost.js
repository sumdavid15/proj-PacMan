'use strict'

const GHOST = 'GHOST'
const GHOST_IMGS = ['<img src="img/0.png">', '<img src="img/1.png">', '<img src="img/2.png">', '<img src="img/3.png">']
var gGhosts = []
const deletedGhosts = []

let row = 2
let col = 8

var gIntervalGhosts

function createGhosts(board) {
    gGhosts = []
    for (var i = 0; i < 4; i++) {
        createGhost(board, GHOST_IMGS[i])
    }
}

function createGhost(board, img) {
    const ghost = {
        id: makeId(),
        location: {
            i: row++,
            j: col
        },
        currCellContent: board[row][col].gameElement,
        img,
        edible: '<img src="img/edible.png">',
        isEaten: false,
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j].gameElement = GHOST
    board[ghost.location.i][ghost.location.j].options = ghost
}

function moveGhosts() {
    if (!gGhosts.length) {
        clearInterval(gIntervalGhosts)
        row = 2
        col = 8
        createGhosts(gBoard)
        gIntervalGhosts = setInterval(moveGhosts, 1000)
        return
    }
    for (let i = 0; i < gGhosts.length; i++) {
        // if (gGhosts[i].isEaten) {
        //     gGhosts[i].location.i = 2
        //     gGhosts[i].location.j = 8
        //     setTimeout(() => gGhosts[i].isEaten = false, 5000)
        //     continue
        // }
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    const moveDiff = getMoveDiff()
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell.type === WALL || nextCell.gameElement === GHOST) return

    if (nextCell.gameElement === PACMAN) {
        if (!gPacman.isSuper) {
            gameOver()
        }
        return
    }

    if (nextCell.gameElement === PACMAN && gPacman.isSuper) {
        deleteGhost(ghost.id)
    }

    gBoard[ghost.location.i][ghost.location.j].gameElement = ghost.currCellContent
    gBoard[ghost.location.i][ghost.location.j].options = null


    let ghostCellContent = ghost.currCellContent
    if (ghost.currCellContent === FOOD) ghostCellContent = FOOD_IMG
    if (ghost.currCellContent === SUPER_FOOD) ghostCellContent = SUPER_FOOD_IMG
    if (ghost.currCellContent === CHERRY) ghostCellContent = CHERRY_IMG
    renderCell(ghost.location, ghostCellContent)

    ghost.currCellContent = nextCell.gameElement
    ghost.location = nextLocation
    gBoard[nextLocation.i][nextLocation.j].gameElement = GHOST
    gBoard[nextLocation.i][nextLocation.j].options = ghost
    if (gPacman.isSuper) {
        renderCell(nextLocation, ghost.edible)
    } else {
        renderCell(nextLocation, ghost.img)
    }
}

function getMoveDiff() {
    const randNum = getRandomInt(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}
