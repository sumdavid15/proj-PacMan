'use strict'

const PACMAN = 'PACMAN'
let PACMAN_IMG = '<img src="img/ArrowRight.png">'
var gPacman

function createPacman(board) {
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false,
    }
    board[gPacman.location.i][gPacman.location.j].gameElement = PACMAN
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell.type === WALL) return
    if (nextCell.gameElement === SUPER_FOOD && gPacman.isSuper) return

    if (nextCell.gameElement === GHOST && gPacman.isSuper) {
        playSound('eating-ghost-2')
        if (nextCell.options.currCellContent === FOOD) updateScore(1)
        if (nextCell.options.currCellContent === CHERRY) updateScore(10)
        // nextCell.isEaten = true
        nextCell.currCellContent = null
        deleteGhost(nextCell.options.id)

    } else if (nextCell.gameElement === GHOST && !gPacman.isSuper) {
        gameOver()
        return
    }

    if (nextCell.gameElement === CHERRY) {
        updateScore(10)
        playSound('eating-fruit')
    }

    if (nextCell.gameElement === FOOD) {
        updateScore(1)
        if (!gPacman.isSuper) playSound('eating-food')
    }

    if (nextCell.gameElement === SUPER_FOOD) {
        gPacman.isSuper = true
        playSound('siren')
        renderBoard(gBoard)
        setTimeout(() => {
            gPacman.isSuper = false
            renderBoard(gBoard)
        }, 5000)
    }

    gBoard[gPacman.location.i][gPacman.location.j].gameElement = null
    renderCell(gPacman.location, EMPTY)

    gBoard[nextLocation.i][nextLocation.j].gameElement = PACMAN
    gPacman.location = nextLocation
    renderCell(nextLocation, PACMAN_IMG)
    checkVictory()
}

function getNextLocation(eventKeyboard) {

    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard) {
        case 'ArrowUp':
            PACMAN_IMG = `<img src="img/${eventKeyboard}.png">`
            nextLocation.i--
            break;
        case 'ArrowRight':
            PACMAN_IMG = `<img src="img/${eventKeyboard}.png">`
            nextLocation.j++
            break;
        case 'ArrowDown':
            PACMAN_IMG = `<img src="img/${eventKeyboard}.png">`
            nextLocation.i++
            break;
        case 'ArrowLeft':
            PACMAN_IMG = `<img src="img/${eventKeyboard}.png">`
            nextLocation.j--
            break;
    }
    return nextLocation
}