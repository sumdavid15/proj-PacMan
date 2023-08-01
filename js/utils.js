'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function getEmptyCells() {
    const emptyCells = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const wall = gBoard[i][j].type === WALL
            if (gBoard[i][j].gameElement === null && !wall) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function addCherry() {
    const emptyCells = getEmptyCells()
    if (!emptyCells.length) return

    const randomCell = emptyCells[getRandomInt(0, emptyCells.length)]

    gBoard[randomCell.i][randomCell.j].gameElement = CHERRY
    renderCell(randomCell, CHERRY_IMG)
}

function findIndexGhostById(id) {
    return gGhosts.findIndex(ghost => ghost.id === id)
}

function deleteGhost(id) {
    const ghostId = findIndexGhostById(id)
    const ghost = gGhosts.splice(ghostId, 1)
    deletedGhosts.push(ghost)
}

function checkForFood() {
    let count = 0
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.gameElement === FOOD ||
                currCell.gameElement === GHOST && currCell.options.currCellContent === FOOD) count++
        }
    }
    return count
}

function checkVictory() {
    if (checkForFood()) return
    playSound('level-complete-sfx')
    clearInterval(gCherryInterval)
    clearInterval(gIntervalGhosts)
    gGame.isOn = false
    alert('Great Score')
}

function playSound(sound) {
    new Audio(`sound/${sound}.mp3`).play()
}

function resetGame() {
    row = 2
    col = 8
    gGame.score = 0
    PACMAN_IMG = '<img src="img/ArrowRight.png">'
    updateScore(0)
    clearInterval(gCherryInterval)
    clearInterval(gIntervalGhosts)
}