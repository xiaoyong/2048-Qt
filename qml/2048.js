var score = 0;
var bestScore = settings.value("bestScore", 0);

var gridSize = 4;
var cellValues;
var tileItems = [];
var availableCells;
var targetLevel = 11;
var checkTargetFlag = true;
var tileComponent = Qt.createComponent("Tile.qml");

var label = settings.value("label", "2048");
var labelOptions = ["2048", "Degree", "Military Rank", "PRC"];
var labelFunc = {
    "2048":
    function(n) {
        return Math.pow(2, n).toString();
    },
    "PRC":
    function(n) {
        var arr = ["商", "周", "秦", "汉", "唐", "宋", "元", "明", "清", "民国", "天朝", "天庭"];
        if (n > 0 && n < arr.length)
            return arr[n-1];
        else
            return "";
    },
    "Military Rank":
    function(n) {
        var arr = ["少尉", "中尉", "上尉", "少校", "中校", "上校", "大校", "少将", "中将", "上将", "元帅", "大元帅"];
        if (n > 0 && n < arr.length)
            return arr[n-1];
        else
            return "";
    },
    "Degree":
    function(n) {
        var arr = ["幼儿园", "小学", "初中", "高中", "学士", "硕士", "博士", "博士后", "勇士", "壮士", "烈士", "圣斗士"];
        if (n > 0 && n < arr.length)
            return arr[n-1];
        else
            return "";
    }
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

    for (i = 0; i < Math.pow(gridSize, 2); i++) {
        try {
            tileItems[i].destroy();
        } catch(e) {
        }
        tileItems[i] = null;
    }

    updateAvailableCells();
    createNewTileItems(true);
    updateScore(0);
    addScoreText.parent = scoreBoard.itemAt(0);

    // Save the currently achieved best score
    if (bestScore > settings.value("bestScore", 0)) {
        console.log("Updating new high score...");
        settings.setValue("bestScore", bestScore);
    }

    console.log("Started a new game");
}

function moveKey(event) {
    var isMoved = false;
    var i, j;
    var v, v2, mrg, indices;
    var oldScore = score;
    switch (event.key) {
    case Qt.Key_Left:
        for (i = 0; i < gridSize; i++) {
            v = cellValues[i];
            mrg = mergeVector(v);
            v2 = mrg[0];
            indices = mrg[1];

            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                moveMergeTilesLeftRight(i, v, v2, indices, true);
                cellValues[i] = v2;
            }
        }
        event.accepted = true;
        break;
    case Qt.Key_Right:
        for (i = 0; i < gridSize; i++) {
            v = cellValues[i].slice();
            v.reverse();
            mrg = mergeVector(v);
            v2 = mrg[0];
            indices = mrg[1];

            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                v.reverse();
                v2.reverse();
                indices.reverse();
                for (j = 0; j < indices.length; j++)
                    indices[j] = gridSize - 1 - indices[j];
                moveMergeTilesLeftRight(i, v, v2, indices, false);
                cellValues[i] = v2;
            }
        }
        event.accepted = true;
        break;
    case Qt.Key_Up:
        for (i = 0; i < gridSize; i++) {
            v = cellValues.map(function(row) {return row[i];});
            mrg = mergeVector(v);
            v2 = mrg[0];
            indices = mrg[1];

            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                moveMergeTilesUpDown(i, v, v2, indices, true);
                for (j = 0; j < gridSize; j++) {
                    cellValues[j][i] = v2[j];
                }
            }
        }
        event.accepted = true;
        break;
    case Qt.Key_Down:
        for (i = 0; i < gridSize; i++) {
            v = cellValues.map(function(row) {return row[i];});
            v.reverse();
            mrg = mergeVector(v);
            v2 = mrg[0];
            indices = mrg[1];

            if (! arraysIdentical(v,v2)) {
                isMoved = true;
                v.reverse();
                v2.reverse();
                indices.reverse();
                for (j = 0; j < gridSize; j++) {
                    indices[j] = gridSize - 1 - indices[j];
                    cellValues[j][i] = v2[j];
                }
                moveMergeTilesUpDown(i, v, v2, indices, false);
            }
        }
        event.accepted = true;
        break;
    }

    if (isMoved) {
        updateAvailableCells();
        createNewTileItems(false);
        if (oldScore !== score) {
            if (bestScore < score) {
                bestScore = score;
            }
            updateScore(oldScore);
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
    var i, j;
    var vlen = v0.length;
    var indices = [];
    // Pass 1: remove zero elements
    var v = [];
    for (i = 0; i < vlen; i++) {
        indices[i] = v.length;
        if (v0[i] > 0) {
            v.push(v0[i]);
        }
    }

    // Pass 2: merge same elements
    var v2 = [];
    for (i = 0; i < v.length; i++) {
        if (i === v.length - 1) {
            // The last element
            v2.push(v[i]);
        } else {
            if (v[i] === v[i+1]) {
                // move all right-side elements to left by 1
                for (j = 0; j < vlen; j++) {
                    if (indices[j] > v2.length)
                        indices[j] -= 1;
                }
                // Merge i-1 and i
                v2.push(v[i] + 1);
                score += Math.pow(2, v[i] + 1);
                i++;
            } else {
                v2.push(v[i]);
            }
        }
    }

    // Fill the gaps with zeros
    for (i = v2.length; i < vlen; i++)
        v2[i] = 0;

    return [v2, indices];
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

function createNewTileItems(isStartup) {
    var i, sub, nTiles;

    if (isStartup) {
        nTiles = 2;
    } else {
        nTiles = 1;
    }

    // Popup a new number
    for (i = 0; i < nTiles; i++) {
        var oneOrTwo = Math.random() < 0.9 ? 1: 2;
        var randomCellId = availableCells[Math.floor(Math.random() * availableCells.length)];

        sub = ind2sub(randomCellId);
        cellValues[sub[0]][sub[1]] = oneOrTwo;

        tileItems[randomCellId] = createTileObject(randomCellId, oneOrTwo, isStartup);

        // Mark this cell as unavailable
        var idx = availableCells.indexOf(randomCellId);
        availableCells.splice(idx, 1);
    }
}

function updateScore(oldScore) {
    if (score > oldScore) {
        addScoreText.text = "+" + (score-oldScore).toString();
        addScoreAnim.running = true;
    }

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

function computeTileStyle(n, tileText) {
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

    /* Adjust font size according to the length of the text
    <= 2: 55
    {3, 4}: 45
    {5, 6}: 35
    > 6: 30
    */
    var tlen = getLengthInBytes(tileText);
    if (tlen <= 2)
        sty.fontSize = 50;
    else if (tlen <= 4)
        sty.fontSize = 40;
    else if (tlen <= 6)
        sty.fontSize = 30;
    else
        sty.fontSize = 20;

    return sty;
}

function getLengthInBytes(str) {
    // getLengthInBytes("一二三") = 6
    // getLengthInBytes("123") = 3
    var b = str.match(/[^\x00-\xff]/g); // Multi-byte characters (Chinese) occupy twice more space
    return (str.length + (!b ? 0: b.length));
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

function createTileObject(ind, n, isStartup) {
    var tile;
    var tileText = labelFunc[label](n);
    var sty = computeTileStyle(n, tileText);

    tile = tileComponent.createObject(tileGrid, {"x": cells.itemAt(ind).x, "y": cells.itemAt(ind).y, "color": sty.bgColor, "tileColor": sty.fgColor, "tileFontSize": sty.fontSize, "tileText": tileText});
    if (! isStartup) {
        tile.runNewTileAnim = true;
    }

    if (tile === null) {
        // Error Handling
        console.log("Error creating a new tile");
    }

    return tile;
}

function moveMergeTilesLeftRight(i, v, v2, indices, left) {
    var j0, j;
    for (j0 = 0; j0 < v.length; j0++) {
        if (left) {
            j = j0;
        } else {
            j = v.length - 1 - j0;
        }

        if (v[j] > 0 && indices[j] !== j) {
            if (v2[indices[j]] > v[j] && tileItems[gridSize*i+indices[j]] !== null) {
                // Move and merge
                tileItems[gridSize*i+j].destroyFlag = true;
                tileItems[gridSize*i+j].z = -1;
                tileItems[gridSize*i+j].opacity = 0;
                tileItems[gridSize*i+j].x = cells.itemAt(gridSize*i+indices[j]).x;
//                tileItems[gridSize*i+j].destroy();

                var tileText = labelFunc[label](v2[indices[j]]);
                var sty = computeTileStyle(v2[indices[j]], tileText);
                tileItems[gridSize*i+indices[j]].tileText = tileText;
                tileItems[gridSize*i+indices[j]].color = sty.bgColor;
                tileItems[gridSize*i+indices[j]].tileColor = sty.fgColor;
                tileItems[gridSize*i+indices[j]].tileFontSize = sty.fontSize;
            } else {
                // Move only
                tileItems[gridSize*i+j].x = cells.itemAt(gridSize*i+indices[j]).x;
                tileItems[gridSize*i+indices[j]] = tileItems[gridSize*i+j];
            }
            tileItems[gridSize*i+j] = null;
        }
    }
}

function moveMergeTilesUpDown(i, v, v2, indices, up) {
    var j0, j;
    for (j0 = 0; j0 < v.length; j0++) {
        if (up) {
            j = j0;
        } else {
            j = v.length - 1 - j0;
        }

        if (v[j] > 0 && indices[j] !== j) {
            if (v2[indices[j]] > v[j] && tileItems[gridSize*indices[j]+i] !== null) {
                // Move and merge
                tileItems[gridSize*j+i].destroyFlag = true;
                tileItems[gridSize*j+i].z = -1;
                tileItems[gridSize*j+i].opacity = 0;
                tileItems[gridSize*j+i].y = cells.itemAt(gridSize*indices[j]+i).y;
//                tileItems[gridSize*j+i].destroy();

                var tileText = labelFunc[label](v2[indices[j]]);
                var sty = computeTileStyle(v2[indices[j]], tileText);
                tileItems[gridSize*indices[j]+i].tileText = tileText;
                tileItems[gridSize*indices[j]+i].color = sty.bgColor;
                tileItems[gridSize*indices[j]+i].tileColor = sty.fgColor;
                tileItems[gridSize*indices[j]+i].tileFontSize = sty.fontSize;
            } else {
                // Move only
                tileItems[gridSize*j+i].y = cells.itemAt(gridSize*indices[j]+i).y;
                tileItems[gridSize*indices[j]+i] = tileItems[gridSize*j+i];
            }
            tileItems[gridSize*j+i] = null;
        }
    }
}

function cleanUpAndQuit() {
    if (bestScore > settings.value("bestScore", 0)) {
        console.log("Updating new high score...");
        settings.setValue("bestScore", bestScore);
    }
    Qt.quit();
}
