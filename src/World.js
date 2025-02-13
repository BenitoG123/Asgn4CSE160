// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {

    if (u_whichTexture == -2) {           //Use color
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {    //Use UV debug color
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (u_whichTexture == 0) {     //Use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else {                              //Error, put Redish color
      gl_FragColor = vec4(1,.2,.2,1);
    }

    //gl_FragColor = vec4(1.0);

  }`

  //Global Variables
  let canvas;
  let gl;
  let a_Position;
  let a_UV;
  let u_FragColor;
  let u_Size;
  //let u_Alpha;
  let u_ModelMatrix;
  let u_ProjectionMatrix;
  let u_ViewMatrix;
  let u_GlobalRotateMatrix;
  let u_Sampler0;
  let u_whichTexture;

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

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
      console.log('Failed to get the storage location of a_UV');
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

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
      console.log('Failed to get the storage location of u_ViewMatrix');
      return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
      console.log('Failed to get the storage location of u_ProjectionMatrix');
      return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
      console.log('Failed to get the storage location of u_whichTexture');
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
//let g_selectedAlpha = 1.0;
let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_yellowAngle = 40;
let g_magentaAngle = -45;
let g_finalAngle = -45;
let g_msize = 1;
let g_animation = false;
let g_animation2 = false;

let g_camera = new Camera();


function addActionsForHtmlUI(){

  //button events (shape type)
  //document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  //document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  //document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

  //document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  //document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  //document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  //document.getElementById('imgButton').onclick = makeImg;

  document.getElementById('animationOnButton').onclick = function() {g_animation=true};
  document.getElementById('animationOffButton').onclick = function() {g_animation=false};

  document.getElementById('animationOnButton2').onclick = function() {g_animation2=true};
  document.getElementById('animationOffButton2').onclick = function() {g_animation2=false};

  //Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
  //document.getElementById('segSlide').addEventListener('mouseup', function() { segments = this.value; });

  document.getElementById('angleXSlide').addEventListener('mousemove', function() { g_globalXAngle = parseInt(this.value); renderAllShapes(); });
  document.getElementById('angleYSlide').addEventListener('mousemove', function() { g_globalYAngle = parseInt(this.value); renderAllShapes(); });
  
  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
  document.getElementById('finalSlide').addEventListener('mousemove', function() { g_finalAngle = this.value; renderAllShapes(); });
  
  
  
  //Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  //document.getElementById('alphaSlide').addEventListener('mouseup', function() { g_selectedAlpha = this.value; });

  document.addEventListener('mousedown', function(ev) { if (ev.shiftKey) {shiftKey();}  });
}

//book functions for UV

function initTextures() {
  
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToTEXTURE0(image); };
  // Tell the browser to load an image
  image.src = '../textures/sky.jpg';

  //repeat for more textures

  return true;
}

function sendTextureToTEXTURE0(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log("finished loadTexture");
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
  document.onkeydown = keydown;


  initTextures();


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




function keydown(ev) {

  if (ev.keyCode == 87) { // w
    g_camera.forward();
    //console.log(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2], g_at.elements[0], g_at.elements[1], g_at.elements[2], g_up.elements[0], g_up.elements[1], g_up.elements[2]);
  } else 
  if (ev.keyCode == 65) { // a
    g_camera.left();
  } else 
  if (ev.keyCode == 83) { // s
    g_camera.back();
  } else 
  if (ev.keyCode == 68) { // d
    g_camera.right();
  } else
  if (ev.keyCode == 68) { // q
    g_camera.rotateLeft();
  } else
  if (ev.keyCode == 68) { // e
    g_camera.rotateRight();
  }

}


function updateAnimationAngles() {
  if (g_animation) {
    g_yellowAngle = (30*Math.sin(g_seconds));
    g_magentaAngle = (45*Math.sin(2.5*g_seconds));
    g_finalAngle = (45*Math.sin(2.0*g_seconds));
  }

  if (g_animation2) {
    g_msize = 1*Math.abs(Math.sin(2.0*g_seconds))
  }
}

/*
var g_eye = new Vector3();
g_eye[0] = 0;
g_eye[1] = 0;
g_eye[2] = 0;
var g_at = new Vector3();
g_at[0] = 0;
g_at[1] = 0;
g_at[2] = -1;
var g_up = new Vector3();
g_up[0] = 0;
g_up[1] = 1;
g_up[2] = 0;
*/


//console.log(g_camera);


var g_map = [];

function drawMap() {
  for (x=0; x<32; x++) {
    for (y=0; y<32; y++) {
      if (g_map[x][y] > 0) {
        var block = new Cube([1.0,g_map[x][y],1.0,1.0]);
        block.matrix.translate(0, 0.75, 0);
        block.matrix.translate(x-16, g_map[x][y], y-16);
        block.matrix.scale(0.3,0.3,0.3);
        block.render();
      }
    }
  }
}

function renderAllShapes() {

  //check the time at the start of this function
  var startTime = performance.now();

  //var xAngleRads = g_globalXAngle * Math.PI/180;

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 1000); //(fov, aspect, near, far)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(
      g_camera.eye.x,g_camera.eye.y,g_camera.eye.z, 
      g_camera.at.x,g_camera.at.y,g_camera.at.z, 
      g_camera.up.x,g_camera.up.y,g_camera.up.z); // (eye, at, up);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);



  var globalRotMat = new Matrix4().rotate(g_globalXAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalYAngle, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);



  //Draw the floor
  var floor = new Cube([0.0,1.0,0.0,1.0]);
  floor.textureNum = -2;
  floor.matrix.translate(0, -0.75, 0.0);
  floor.matrix.translate(-5, 0, 5);
  floor.matrix.scale(10, 0, 10);
  floor.render();

  //draw the sky
  var sky = new Cube([0.0, 0.0, 1.0, 1.0]);
  sky.textureNum = 0;
  sky.matrix.translate(-25, -15, 25);
  sky.matrix.scale(50,50,50);
  sky.render();

  
  var octbody = new Octagon3d([1.0,0.0,1.0,1.0]);
  octbody.matrix.translate(-0.2,-0.75,-0.25);
  octbody.render();
  
  
  var neck = new Cube([0.9,0.0,0.9,1.0]);
  neck.matrix.translate(-0.05,-0.4,0.30);
  neck.matrix.scale(0.1,0.3,0.1);
  neck.render();

  var head = new Cube([0.9,0.0,0.9,1.0]);
  head.matrix.translate(-0.25,-0.20,0.5);
  head.matrix.scale(0.5,0.5,0.5);
  head.textureNum = 0;
  head.render();

  var leftEye = new Cube([1.0,1.0,1.0,1.0]);
  leftEye.matrix.translate(-0.15,0.07,0.05);
  leftEye.matrix.scale(0.1,0.1,0.1);
  leftEye.render();

  var leftPuple = new Cube([0.0,0.0,0.0,1.0]);
  leftPuple.matrix.translate(-0.1,0.11,0.04);
  leftPuple.matrix.scale(0.02,0.02,0.1);
  leftPuple.render();

  var rightEye = new Cube([1.0,1.0,1.0,1.0]);
  rightEye.matrix.translate(0.05,0.07,0.05);
  rightEye.matrix.scale(0.1,0.1,0.1);
  rightEye.render();

  var rightPuple = new Cube([0.0,0.0,0.0,1.0]);
  rightPuple.matrix.translate(0.1,0.11,0.04);
  rightPuple.matrix.scale(0.02,0.02,0.1);
  rightPuple.render();

  var mouth = new Cube([0.1,0.1,0.1,1.0]);
  mouth.matrix.translate(-0.05,-0.1,0.10);
  mouth.matrix.scale(0.1*g_msize,0.1*g_msize,0.11);
  mouth.render();



  
  var zarmscale = 0.2; //exact number
  var xarmscale = 0.6; //multiplier
  var yarmscale = 0.6; //multiplier
  var legy = -0.65;

  //f
  var leg1x = 0.1;
  var leg1z = 0;
  var leg1yrot = 90;

  //fr
  var leg2x = 0.3;
  var leg2z = 0.1;
  var leg2yrot = 45;

  //r
  var leg3x = 0.35;
  var leg3z = 0.35;
  var leg3yrot = 0;

  //br
  var leg4x = 0.2;
  var leg4z = 0.55;
  var leg4yrot = 315;

  //b
  var leg5x = -0.1;
  var leg5z = 0.55;
  var leg5yrot = 270;

  //bl
  var leg6x = -0.3;
  var leg6z = 0.45;
  var leg6yrot = 225;

  //l
  var leg7x = -0.3;
  var leg7z = 0.15;
  var leg7yrot = 180;

  //fl
  var leg8x = -0.1;
  var leg8z = 0;
  var leg8yrot = 135;

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg1x,legy,leg1z);
  base.matrix.rotate(leg1yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();


  //leg 2

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg2x,legy,leg2z);
  base.matrix.rotate(leg2yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();

  //leg 3

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg3x,legy,leg3z);
  base.matrix.rotate(leg3yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();

  //leg 4

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg4x,legy,leg4z);
  base.matrix.rotate(leg4yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();

  //leg5

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg5x,legy,leg5z);
  base.matrix.rotate(leg5yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();

  //leg6

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg6x,legy,leg6z);
  base.matrix.rotate(leg6yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();

  //leg7

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg7x,legy,leg7z);
  base.matrix.rotate(leg7yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();

  //leg8

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg8x,legy,leg8z);
  base.matrix.rotate(leg8yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.render();

  //draw a left arm
  var longArm = new Cube([0.9,0,0.9,1]);
  longArm.matrix = baseCoordingatesMat;
  longArm.matrix.translate(0.4*xarmscale,0.18*yarmscale,-0.01);
  //longArm.matrix.rotate(-0,1,0,0); //x-axis
  longArm.matrix.rotate(-40,0,0,1); //z-axis
  longArm.matrix.rotate( -g_yellowAngle,0,0,1);

  var longCoordinatesMat = new Matrix4(longArm.matrix);
  longArm.matrix.scale(0.25*xarmscale, 0.55*yarmscale, zarmscale*.95);
  longArm.matrix.translate(-0.5,0,0)
  longArm.render();

  //draw a box
  var short = new Cube([0.8,0,0.8,1]);
  //box.color = [1,0,1,1];
  short.matrix = longCoordinatesMat;
  short.matrix.translate(0.0,0.5*yarmscale,0.02);
  short.matrix.rotate(-g_magentaAngle,0,0,1);

  var shortCoordinatesMat = new Matrix4(short.matrix);
  short.matrix.scale(0.23*xarmscale, 0.4*yarmscale, zarmscale*.90);
  short.matrix.translate(-0.5,0,-0.101);
  short.render();

  var tip = new Cube([0.7,0,0.7,1.0]);
  tip.fixtop = true;
  //box.color = [1,0,1,1];
  tip.matrix = new Matrix4(shortCoordinatesMat);
  tip.matrix.translate(0.0,0.2,0.01);
  tip.matrix.rotate(180,0,0,1);
  tip.matrix.rotate(-g_finalAngle,0,0,1);
  // final.matrix.scale(1, -1,  1);
  tip.matrix.scale(0.2*xarmscale, 0.3*yarmscale, zarmscale*.85);
  tip.matrix.translate(-0.501,-1.5*yarmscale,-0.201);
  tip.render();
  

  


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
  //console.log("global angle values", g_globalXAngle, g_globalYAngle);
  //console.log(typeof(g_globalXAngle))

  //Draw every shape
  renderAllShapes();

}

function shiftKey() {
  console.log("shift click works");
  if (g_animation2 == true) {
    g_animation2 = false;
  } else {
    g_animation2 = true;
  }
  //insert animation
}
