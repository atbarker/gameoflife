
var w;
var columns;
var rows;
var board;
var next;
var interactive;
var cellarray;


function setup() {
  var canvas = createCanvas(1000, 720);
  canvas.parent('sketch-holder');
  //size[0] = 1280;
  //size[1] = 720;
  w = 10;
  // Calculate columns and rows
  columns = floor(width/w);
  rows = floor(height/w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (var i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  } 
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  interactive = new Array(columns);
  for (i = 0; i < columns; i++) {
    interactive[i] = new Array(rows);
  }
  cellarray = new Array(columns);
  for (i = 0; i < columns; i++) {
    cellarray[i] = new Array(rows);
  }
  init();
}

function draw() {
  background(0);
  generate();
  for ( var i = 0; i < columns;i++) {
    for ( var j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) fill(cellarray[i][j]);
      else fill(0); 
      //stroke(0);
      noStroke();
      rect(i*w, j*w, w-1, w-1);
    }
  }
}

// create a new cluster when the mouse is pressed
function mousePressed() {
  locX = getMouseX();
  locY = getMouseY();
  if (board[locX][locY] == 0)
      interactive[locX][locY] = 1;
      interactive[locX-1][locY] = 1;
      interactive[locX+1][locY] = 1;
      interactive[locX][locY+1] = 1;
      interactive[locX][locY-1] = 1;
}

function mouseDragged() {
  locX = getMouseX();
  locY = getMouseY();
  if (board[locX][locY] == 0)
      interactive[locX][locY] = 1;
      interactive[locX-1][locY-1] = 1;
      interactive[locX+1][locY+1] = 1;
      interactive[locX-1][locY+1] = 1;
      interactive[locX+1][locY-1] = 1;
}

function getMouseX() {
  return floor(mouseX/w);
}

function getMouseY() {
  return floor(mouseY/w);
}

// Fill board randomly
function init() {
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly
      else board[i][j] = floor(random(2));
      next[i][j] = 0;
      interactive[i][j] = 0;
      cellarray[i][j] = generateColor();
    }
  }
}

// The process of creating the new generation
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (var x = 1; x < columns - 1; x++) {
    for (var y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      var neighbors = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)){
        next[x][y] = 0;           // Loneliness
      }
      else if ((board[x][y] == 1) && (neighbors >  3)){
        next[x][y] = 0;// Overpopulation
      }
      else if ((board[x][y] == 0) && (neighbors == 3)){
        next[x][y] = 1;           // Reproduction
        cellarray[x][y] = avgColor(x, y);
        //cellColor[x][y] = generateColor();
      }
      else if (interactive[x][y] == 1) {
        next[x][y] = 1;
      }
      else {
        next[x][y] = board[x][y];
        generateRandom(x, y); // Stasis
      }
    }
  }
  wait(100);
  // Swap!
  var temp = board;
  board = next;
  next = temp;
}

//generates color values
function generateColor(){
  var newcolor = color(floor(random(255)), floor(random(255)), floor(random(255)));
  return newcolor;
}

function avgColor(x, y){
  var isUsed;
  var newColor = color(255, 255, 255);
  var finishColor = color(255, 255, 255);
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if(board[x+i][y+j] == 1 && isUsed == 0){
        newColor = cellarray[x+i][y+j];
      }else{
        var old = cellarray[x+i][y+j];
        newColor = lerpColor(old, newColor, 0.5)
      }
    }
  }
  return newColor;
}

function generateRandom(x, y){
  var three = floor(random(1000000));
  if(board[x][y] == 0 && three <= 1){
    var two = floor(random(8));
    interactive[x][y] = 1;
  }
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
