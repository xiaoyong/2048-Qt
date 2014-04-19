var score = 0;
var bestScore = 0;
var gridSize = 4;
var cellValues;
var availableCells;
//var labels = "PRC";
var labels = "2048";
var labelFunc;
var targetLevel = 11;
var checkTargetFlag = true;

switch (labels) {
case "2048":
    labelFunc = function(n) {
        return Math.pow(2, n).toString();
    };
    break;
case "PRC":
    labelFunc = function(n) {
        var dynasties = ["商", "周", "秦", "汉", "唐", "宋", "元", "明", "清", "ROC", "PRC"];
        return dynasties[n-1];
    };
    break;
}


function startupFunction() {
    // Initialize variables
    score = 0;
    checkTargetFlag = true;
    var i;
    var j;

    cellValues = new Array(gridSize);
    for (i = 0; i < gridSize; i++) {
        cellValues[i] = new Array(gridSize);
        for (j = 0; j < gridSize; j++)
            cellValues[i][j] = 0;
    }

    updateAvailableCells();
    refreshCellViews(2);
    updateScore();
    console.log("Started a new game");
}

function moveKey(event) {
    var isMoved = false;
    var i, j, v, v2;
    var oldScore = score;
    switch (event.key) {
    case Qt.Key_Left:
        for (i = 0; i < gridSize; i++) {
            v = cellValues[i];
            v2 = mergeVector(v);
            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                cellValues[i] = v2;
            }
        }
        break;
    case Qt.Key_Right:
        for (i = 0; i < gridSize; i++) {
            v = cellValues[i].slice();
            v.reverse();
            v2 = mergeVector(v);
            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                v2.reverse();
                cellValues[i] = v2;
            }
        }
        break;
    case Qt.Key_Up:
        for (i = 0; i < gridSize; i++) {
            v = cellValues.map(function(row) {return row[i];});
            v2 = mergeVector(v);
            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                for (j = 0; j < gridSize; j++) {
                    cellValues[j][i] = v2[j];
                }
            }
        }
        break;
    case Qt.Key_Down:
        for (i = 0; i < gridSize; i++) {
            v = cellValues.map(function(row) {return row[i];});
            v.reverse();
            v2 = mergeVector(v);
            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                v2.reverse();
                for (j = 0; j < gridSize; j++) {
                    cellValues[j][i] = v2[j];
                }
            }
        }
        break;
    }

    if (isMoved) {
        updateAvailableCells();
        refreshCellViews(1);
        if (oldScore !== score) {
            if (bestScore < score) {
                bestScore = score;
            }
            updateScore();
            if (checkTargetFlag && maxTileValue() >= targetLevel) {
                winMessage.open();
            }
        }
    } else {
        if (isDead()) {
            deadMessage.open();
        }
    }
}

function ind2sub(ind) {
    var sub = [0, 0];
    sub[0] = Math.floor(ind / gridSize);
    sub[1] = ind % gridSize;
    return sub;
}

function mergeVector(v0) {
    // Pass 1: remove zero elements
    var v = v0.slice();
    var i = v.length;
    while (i--) {
        if (v[i] === 0) {
            v.splice(i, 1);
        }
    }
    // Pass 2: merge same elements
    var v2 = [];
    while (v.length > 0) {
        if (v.length > 1 && v[0] === v[1]) {
            v2.push(v[0] + 1);
            score += parseInt(Math.pow(2, v[0]+1));
            v.splice(0, 2);
        } else {
            v2.push(v[0]);
            v.splice(0, 1);
        }
    }

    // Fill the gaps with zeros
    for (i = v2.length; i < v0.length; i++)
        v2[i] = 0;

    return v2;
}

function removeElementsWithValue(arr, val) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === val) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

function arraysIdentical(a, b) {
    var i = a.length;
    if (i !== b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

function updateAvailableCells() {
    availableCells = [];
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (cellValues[i][j] === 0) {
                availableCells.push(i * gridSize + j);
            }
        }
    }
}

function refreshCellViews(n) {
    var i, sub;

    // Popup a new number
    for (i = 0; i < n; i++) {
        var oneOrTwo = Math.random() < 0.9 ? 1: 2;
        var randomCellId = availableCells[Math.floor(Math.random() * availableCells.length)];

        sub = ind2sub(randomCellId);
        cellValues[sub[0]][sub[1]] = oneOrTwo;

        // Mark this cell as unavailable
        var idx = availableCells.indexOf(randomCellId);
        availableCells.splice(idx, 1);
    }

    // Refresh the cell views
    for (i = 0; i < cells.count; i++) {
        sub = ind2sub(i);
        var cv = cellValues[sub[0]][sub[1]];
        var sty = computeTileStyle(cv);
        if ( cv === 0) {
            cells.itemAt(i).tileText = "";
        } else {
            cells.itemAt(i).tileText = labelFunc(cv);
        }
        cells.itemAt(i).color = sty.bgColor;
        cells.itemAt(i).tileColor = sty.fgColor;
        cells.itemAt(i).tileFontSize = sty.fontSize;
    }

}

function updateScore() {
    scoreBoard.itemAt(0).scoreText = MyScript.score.toString();
    scoreBoard.itemAt(1).scoreText = MyScript.bestScore.toString();
}

function isDead() {
    var dead = true;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            if (cellValues[i][j] === 0) {
                dead = false;
            }
            if (i > 0) {
                if (cellValues[i-1][j] === cellValues[i][j]) {
                    dead = false;
                }
            }
            if (j > 0) {
                if (cellValues[i][j-1] === cellValues[i][j]) {
                    dead = false;
                }
            }
        }
    }

    return dead;
}

function computeTileStyle(n) {
    var fgColors = ["#776E62", "#F9F6F2"];
    var bgColors = ["#EEE4DA", "#EDE0C8", "#F2B179", "#F59563", "#F67C5F", "#F65E3B", "#EDCF72", "#EDCC61", "#EDC850", "#EDC53F", "#EDC22E", "#3C3A32"];
    var sty = {bgColor: helper.myColors.bggray,
               fgColor: fgColors[0],
               fontSize: 55 };
    if (n > 0) {
        if (n > 2)
            sty.fgColor = fgColors[1];
        if (n <= bgColors.length)
            sty.bgColor = bgColors[n-1];
        else
            sty.bgColor = bgColors[bgColors.length-1];
    }

    if (labels === "2048") {
        /* Adjust font size according to size of the number
        [2, 100): 55
        [100, 1000): 45
        [1000, 2048]: 35
        > 2048: 30
        */
        var pv = Math.pow(2, n);
        if (pv >= 100 && pv < 1000)
            sty.fontSize = 45;
        else if (pv >= 1000 && pv <= 2048)
            sty.fontSize = 35;
        else if (pv > 2048)
            sty.fontSize = 30;

    }

    return sty;
}

function maxTileValue() {
    var mv = 0;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var cv = cellValues[i][j];
            if ( mv < cv) {
                mv = cv;
            }
        }
    }
    return mv;
}
