//LIBRARY FUNCTIONS
var inf = inf || {};

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
    };
}
function loadImages(sources, callback) {
    var loadedImages = 0;
    var numImages = 0;
    var images = {};
    // get num of sources
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback();
            }
        };
        images[src].src = sources[src];
    }
    return images;
}

function initGrid(xlen, ylen) {
    var out = [];
    for (var i=0; i<xlen; i++) {
        out[i]=[];
        for (var j=0; j<ylen; j++) {
            out[i][j]=null;
        }
    }
    return out;
}
function setGrid(grid, pos, val) {
    if (!grid[pos.x]) {
        grid[pos.x] = [];
    }
    grid[pos.x][pos.y] = val;
    return grid;
}
function getGrid(grid, pos) {
    if (!grid[pos.x]) {
        return null;
    }
    return grid[pos.x][pos.y];
}
function getGridMinNode(grid) {
    var min;
    var minNode;
    for (i=0; i<grid.length; i++) {
        for (j=0; j<grid[i].length; j++) {
            if ((grid[i][j]) && (!min || (grid[i][j] < min))) {
                min = grid[i][j];
                minNode = {x:i, y:j};
            }
        }
    }
    return minNode;
}
function maskGrid(grid, mask) {
    //mask is an array of pos's 
    var newGrid = initGrid(grid.length, grid[0].length);
    for (i=0; i<grid.length; i++) {
        for (j=0; j<grid[i].length; j++) {
            var pos = {x:i, y:j};
            if (posInArray(mask, pos)) {
                setGrid(newGrid, pos, getGrid(grid, pos));
            }
        }
    } 
    return newGrid;   
}

function makePos(x, y) {
    return {x:x, y:y};
}

function getNeighbors(pos, obs, xlen, ylen) {
    var n = [];
    if (pos.x > 0 && !getGrid(obs, makePos(pos.x-1, pos.y))) n.push(makePos(pos.x-1, pos.y));
    if (pos.y > 0 && !getGrid(obs, makePos(pos.x, pos.y-1))) n.push(makePos(pos.x, pos.y-1));
    if (pos.x < xlen-1 && !getGrid(obs, makePos(pos.x+1, pos.y))) n.push(makePos(pos.x+1, pos.y));
    if (pos.y < ylen-1 && !getGrid(obs, makePos(pos.x, pos.y+1))) n.push(makePos(pos.x, pos.y+1));
    return n;
}

function posEquals(a, b) {
    return (a.x==b.x) && (a.y==b.y);
}
function posInArray(arr, pos) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i] && (posEquals(arr[i], pos))) return true;
    }
    return false;
}
function delPosFromArray(arr, pos) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i] && (posEquals(arr[i], pos))) arr[i]=null;
    }
    return arr;
}



