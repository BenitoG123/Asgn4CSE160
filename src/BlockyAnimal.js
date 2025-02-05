// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

  //Global Variables
  let canvas;
  let gl;
  let a_Position;
  let u_FragColor;
  let u_Size;
  let u_Alpha;
  let u_ModelMatrix;
  let u_GlobalRotateMatrix;

function setupWebGL() {
  //retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }
  
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    // Get the storage location of u_Size
    //u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    //if (!u_Size) {
    //  console.log('Failed to get the storage location of u_Size');
    //  return;
    //}

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
      console.log('Failed to get the storage location of u_GlobalRotateMatrix');
      return;
    }

    //set an initial value for this matrix to identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Globals related UI elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_selectedAlpha = 1.0;
let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_animation = false;
let g_animation2 = false;


function addActionsForHtmlUI(){

  //button events (shape type)
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  document.getElementById('imgButton').onclick = makeImg;

  document.getElementById('animationOnButton').onclick = function() {g_animation=true};
  document.getElementById('animationOffButton').onclick = function() {g_animation=false};

  document.getElementById('animationOnButton2').onclick = function() {g_animation2=true};
  document.getElementById('animationOffButton2').onclick = function() {g_animation2=false};

  //Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
  document.getElementById('segSlide').addEventListener('mouseup', function() { segments = this.value; });

  document.getElementById('angleXSlide').addEventListener('mousemove', function() { g_globalXAngle = parseInt(this.value); renderAllShapes(); });
  document.getElementById('angleYSlide').addEventListener('mousemove', function() { g_globalYAngle = parseInt(this.value); renderAllShapes(); });
  
  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
  
  
  
  //Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('alphaSlide').addEventListener('mouseup', function() { g_selectedAlpha = this.value; });

  document.addEventListener('mouseEvent.shiftKey', function() { shiftKey(); });
}

function makeImg() {
  console.log("makeImg");
  g_shapesList = []; 
  renderAllShapes();

 

  //Draw every shape
  renderAllShapes();

}

//extrant the event click and return it in webgl coordinates
function convertCorrdinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  //set up actions for HTML UI elements
  addActionsForHtmlUI();


  // Register function (event handler) to be called on a mouse press
  //canvas.mouseEvent.shiftKey = shiftclick;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //renderAllShapes();
  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;


function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  //console.log(performance.now());

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}





function updateAnimationAngles() {
  if (g_animation) {
    g_yellowAngle = (45*Math.sin(g_seconds));
  }

  if (g_animation2) {
    g_magentaAngle = (45*Math.sin(3*g_seconds));
  }
}

function renderAllShapes() {

  //check the time at the start of this function
  var startTime = performance.now();

  //var xAngleRads = g_globalXAngle * Math.PI/180;


  var globalRotMat = new Matrix4().rotate(g_globalXAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalYAngle, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //drawTriangle3D( [-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0] );

  //draw the cube body
  var body = new Cube([1.0,0.0,0.0,1.0]);
  body.matrix.translate(-0.25,-0.75,0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5, 0.3, 0.5);
  body.render();

  //draw a left arm
  var leftArm = new Cube([1,1,0,1]);
  leftArm.matrix.setTranslate(0.0,-0.5,0.0);
  leftArm.matrix.rotate(-5,1,0,0);
  //animation
  //if (g_animation) {
  //  leftArm.matrix.rotate(45*Math.sin(g_seconds), 0,0,1);
  //} else{
  //  leftArm.matrix.rotate(-g_yellowAngle,0,0,1);
  //}
  leftArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.matrix.translate(-0.5,0,0)
  leftArm.render();

  //draw a box
  var box = new Cube([1,0,1,1]);
  //box.color = [1,0,1,1];
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0.0,0.65,0);
  box.matrix.rotate(g_magentaAngle,0,0,1);
  box.matrix.scale(0.3, 0.3, 0.3);
  box.matrix.translate(-0.5,0,-0.001);
  box.render();


  //check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

var g_shapesList = [];
var segments = 5;

function click(ev) {

  //extract the event click and return it in WebGL coordinates
  [x,y] = convertCorrdinatesEventToGL(ev);
  //console.log("click on ", x, y);
  var mousesense = 7;

  g_globalXAngle += x*mousesense;
  g_globalYAngle += y*mousesense;
  console.log("global angle values", g_globalXAngle, g_globalYAngle);
  console.log(typeof(g_globalXAngle))

  //onmoutsemove

  //g_globalXAngle

  //Create and store the new point
  //let point;
  //if (g_selectedType==POINT) {
  //  point = new Point();
  //} else if (g_selectedType==TRIANGLE) {
  //  point = new Triangle();
  //} else {
  //  point = new Circle(segments);
  //  //console.log("circle class");
  //}
  
  //point.position = [x,y];
  //point.color = g_selectedColor.slice();
  //point.size = g_selectedSize;
  //point.alpha = g_selectedAlpha/100;
  //g_shapesList.push(point);

  //g_shapesList.push(point);

  //Draw every shape
  renderAllShapes();

}

function shiftclick() {
  //insert animation
}
