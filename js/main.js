'use strict';
console.log('I am Sokoban!');

var gBoard;
var gTargetCells;
var gElBoard;
var gElTimer;
var gElAlert;
var gPlayerPos
var gStepsCount;
var INITIAL_SCORE = 100;
var gIsGameOn;

function initGame() {
    gBoard = buildBoard(gBoard);
    gTargetCells = storeTargetSquares(gBoard);
    // console.log('targets:', gTargetCells);
    gPlayerPos = { i: 8, j: 11 }; //static init, see buildBoard comments for reason
    gElBoard = document.querySelector('.game-board');
    // console.table(gBoard);
    gElTimer = document.querySelector('.timer');
    gElAlert = document.querySelector('.alert');
    renderBoard(gBoard, gElBoard);
    gStepsCount = 0;
    gElTimer.innerText = 'score: ' + Math.max(0, INITIAL_SCORE);
    gIsGameOn = true;
    gElAlert.innerText = 'Playing';
}

function buildBoard(board) { //I'm building a static board which is similar to sokoban level one
    //not going with some sort of more randomized board since I want something 
    //that can actually be played and completed, Apologies for the ugliness
    var board = [
        ['F', 'F', 'F', 'F', 'W', 'W', 'W', 'W', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
        ['F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
        ['F', 'F', 'F', 'F', 'W', 'B', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
        ['F', 'F', 'W', 'W', 'W', 'F', 'F', 'B', 'W', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
        ['F', 'F', 'W', 'F', 'F', 'B', 'F', 'B', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
        ['W', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'F', 'F', 'W', 'W', 'W', 'W', 'W', 'W'],
        ['W', 'F', 'F', 'F', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'W', 'F', 'F', 'S', 'S', 'W'],
        ['W', 'F', 'B', 'F', 'F', 'B', 'F', 'A', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'S', 'S', 'W'],
        ['W', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'P', 'W', 'W', 'F', 'F', 'S', 'S', 'W'],
        ['F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        ['F', 'F', 'F', 'F', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F']
    ];
    return board;
}

function storeTargetSquares(board) {
    var targets = [];
    var targetPos = {};
    board.forEach(function (row, posI) {
        row.forEach(function (cell, posJ) {
            if (cell === 'S') {
                targetPos.i = posI;
                targetPos.j = posJ;
                targets.push(targetPos);
                targetPos = {};
            }
        });
    });
    return targets;
}

function renderBoard() {
    var strHTML = '';
    gBoard.forEach(function (row, i) {
        strHTML += '<tr> \n';
        row.forEach(function (cell, j) {
            switch (cell) {
                case 'W':
                    strHTML += '<td id = "' + i + '-' + j + '"' + 'onclick = "cellClicked(this)"' + '>' + '<img src="img/wall.png"> </td> \n';
                    break;
                case 'B':
                    strHTML += '<td id = "' + i + '-' + j + '"' + 'onclick = "cellClicked(this)"' + '>' + '<img src="img/box.png"> </td> \n';
                    break;
                case 'P':
                    strHTML += '<td id = "' + i + '-' + j + '"' + '>' + '<img src="img/player.png"> </td> \n';
                    break;
                case 'S':
                    strHTML += '<td id = "' + i + '-' + j + '"' + 'onclick = "cellClicked(this)"' + '>' + '<img src="img/xSpot.png"> </td> \n';
                    break;
                case 'G':
                    strHTML += '<td id = "' + i + '-' + j + '"' + 'onclick = "cellClicked(this)"' + '>' + '<img src="img/glue.png"> </td> \n';
                    break;
                case 'A':
                    strHTML += '<td id = "' + i + '-' + j + '"' + 'onclick = "cellClicked(this)"' + '>' + '<img src="img/puddle.png"> </td> \n';
                    break;
                default:
                    strHTML += '<td id = "' + i + '-' + j + '"' + 'onclick = "cellClicked(this)"' + '>' + ' </td> \n';
                    break;
            }
        });
        strHTML += '</tr> \n'
    });
    // console.log('str html:', strHTML);
    gElBoard.innerHTML = strHTML;
}

function cellClicked(elCell) {
    if (!gIsGameOn) return;
    var clickedCellCoords = getCellCoord(elCell.id);
    var isLegalMove = checkMove(clickedCellCoords.i, clickedCellCoords.j);
    if (isLegalMove) movePlayer(clickedCellCoords.i, clickedCellCoords.j)

    renderBoard();
}

function checkMove(targetPosI, targetPosJ) {
    //horizontal or diagoal:
    var currI = gPlayerPos.i;
    var currJ = gPlayerPos.j;

    var isDirectionOk = (currI === targetPosI && currJ === targetPosJ + 1) || (currI === targetPosI && currJ === targetPosJ - 1) ||
        (currI === targetPosI + 1 && currJ === targetPosJ) || (currI === targetPosI - 1 && currJ === targetPosJ);

    //can't move into wall
    var isNotWall = gBoard[targetPosI][targetPosJ] !== 'W';

    // box blocked by wall or another box
    var isNotBlocked = true;
    if (gBoard[targetPosI][targetPosJ] === 'B') {
        var nextTargetI = currI + (targetPosI - currI) * 2;
        var nextTargetJ = currJ + (targetPosJ - currJ) * 2;
        isNotBlocked = (gBoard[nextTargetI][nextTargetJ] !== 'W' && gBoard[nextTargetI][nextTargetJ] !== 'B')
    }

    return isDirectionOk && isNotWall && isNotBlocked;
}

function movePlayer(targetPosI, targetPosJ) {
    var prevI = gPlayerPos.i;
    var prevJ = gPlayerPos.j;

    gPlayerPos.i = targetPosI;
    gPlayerPos.j = targetPosJ;

    var targetContent = gBoard[targetPosI][targetPosJ];

    switch (targetContent) {
        case 'F':
        case 'S':
            gBoard[prevI][prevJ] = 'F';
            gBoard[gPlayerPos.i][gPlayerPos.j] = 'P';
            break;
        case 'B': //moving player to a square with a box
            gBoard[prevI][prevJ] = 'F';
            var nextTargetI = prevI + (targetPosI - prevI) * 2;
            var nextTargetJ = prevJ + (targetPosJ - prevJ) * 2;
            gBoard[nextTargetI][nextTargetJ] = targetContent;
            gBoard[gPlayerPos.i][gPlayerPos.j] = 'P';
            break;
        case 'G': //moving player to a square with glue
            gBoard[prevI][prevJ] = 'F';
            gBoard[gPlayerPos.i][gPlayerPos.j] = 'P';
            gIsGameOn = false;
            gStepsCount += 5;
            gElAlert.innerText = 'Stuck! Lost 5 seconds and 5 Points!';
            setTimeout(function () {
                gIsGameOn = true;
                gElAlert.innerText = 'Playing';
            }, 5000);
            break;
        case 'A':
            gBoard[prevI][prevJ] = 'F';
            gBoard[gPlayerPos.i][gPlayerPos.j] = 'P';
            break;
    }
    gStepsCount++;
    gElTimer.innerText = 'score: ' + Math.max(0, (100 - gStepsCount));
    // ('steps:', gStepsCount);
    checkGameOver();
    reprintspots();
}

function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(0, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    // console.log('coord', coord);
    return coord;
}

function reprintspots() {
    gTargetCells.forEach(function (target) {
        var posI = target.i;
        var posJ = target.j;
        if (gBoard[posI][posJ] === 'F') gBoard[posI][posJ] = 'S';
    });
}

function checkGameOver() {
    var boxLocs = [];
    gBoard.forEach(function (row, posI) {
        row.filter(function (cell, posJ) {
            if (cell === 'B') {
                var boxPos = {}
                boxPos.i = posI;
                boxPos.j = posJ;
                boxLocs.push(boxPos);
            }
        });
    });
    // console.log('currently boxes are on:', boxLocs);
    var isWin = gTargetCells.every(function (target) {
        return boxLocs.find(function (loc) {
            return loc.i === target.i && loc.j === target.j;
        });
    });
    if (isWin) {
        gIsGameOn = false;
        gElTimer.innerText = 'Final score: ' + Math.max(0, (100 - gStepsCount));
        gElAlert.innerText = 'Game Won!';
    }
}
