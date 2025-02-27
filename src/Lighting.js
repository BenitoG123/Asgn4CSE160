// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_NormalMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    
    v_UV = a_UV;
    //v_Normal = a_Normal;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1.0)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform sampler2D u_Sampler8;
  //uniform sampler2D u_Sampler9;
  uniform int u_whichTexture;
  void main() {

    if (u_whichTexture == -3) {           //Use normal
      gl_FragColor = vec4((v_Normal), 1.0);
    } else if (u_whichTexture == -2) {           //Use color
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {    //Use UV debug color
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (u_whichTexture == 0) {     //Use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {     //Use texture1
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {     //Use texture2
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {     //Use texture3
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {     //Use texture4
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else if (u_whichTexture == 5) {     //Use texture5
      gl_FragColor = texture2D(u_Sampler5, v_UV);
    } else if (u_whichTexture == 6) {     //Use texture6
      gl_FragColor = texture2D(u_Sampler6, v_UV);
    } else if (u_whichTexture == 7) {     //Use texture7
      gl_FragColor = texture2D(u_Sampler7, v_UV);
    } else if (u_whichTexture == 8) {     //Use texture8
      gl_FragColor = texture2D(u_Sampler8, v_UV);
    } else {                              //Error, put Redish color
      gl_FragColor = vec4(1,.2,.2,1);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    //Red/Green
    //if (r < 1.0) {
    //  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //} else if (r < 2.0) {
    //  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    //}
    

    // 1/r^2
    //gl_FragColor = vec4((vec3(gl_FragColor)/(r*r)), 1);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    //reflection
    vec3 R = reflect(-L, N);

    //eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specExp = 10.0;
    float specular = pow(max(dot(E,R), 0.0), specExp);



    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    
    if (u_lightOn) {
      if (u_whichTexture >= 3) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
      gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    } 
    //   else {
    //  if (u_whichTexture >= 3) {
    //     gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
    //   } else {
    //   gl_FragColor = vec4(diffuse + ambient, 1.0);
    //   }
    // }


  }`

  //Global Variables
  let canvas;
  let gl;
  let a_Position;
  let a_UV;
  let a_Normal;
  let u_FragColor;
  let u_Size;
  //let u_Alpha;
  let u_ModelMatrix;
  let u_ProjectionMatrix;
  let u_ViewMatrix;
  let u_GlobalRotateMatrix;
  let u_NormalMatrix;
  let u_Sampler0;
  let u_Sampler1;
  let u_Sampler2;
  let u_Sampler3;
  let u_Sampler4;
  let u_Sampler5;
  let u_Sampler6;
  let u_Sampler7;
  let u_Sampler8;
  let u_whichTexture;
  let u_lightPos;
  let u_cameraPos;
  let u_lightOn;

  let g_camera;

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

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
      console.log('Failed to get the storage location of a_Normal');
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

    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
      console.log('Failed to get the storage location of u_NormalMatrix');
      return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return;
    }

    u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
    if (!u_Sampler4) {
      console.log('Failed to get the storage location of u_Sampler4');
      return;
    }

    u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
    if (!u_Sampler5) {
      console.log('Failed to get the storage location of u_Sampler5');
      return;
    }

    u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
    if (!u_Sampler6) {
      console.log('Failed to get the storage location of u_Sampler6');
      return;
    }

    u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
    if (!u_Sampler7) {
      console.log('Failed to get the storage location of u_Sampler7');
      return;
    }

    u_Sampler8 = gl.getUniformLocation(gl.program, 'u_Sampler8');
    if (!u_Sampler8) {
      console.log('Failed to get the storage location of u_Sampler8');
      return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
      console.log('Failed to get the storage location of u_whichTexture');
      return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
      console.log('Failed to get the storage location of u_lightPos');
      return;
    }

    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
      console.log('Failed to get the storage location of u_cameraPos');
      return;
    }

    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
      console.log('Failed to get the storage location of u_lightOn');
      return;
    }

    //set an initial value for this matrix to identity
    var identityM = new Matrix4();
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

    g_camera = new Camera();
    console.log("g_camera", g_camera.eye);
    //g_camera.eye = new Vector3([0,0,-3]);
    //g_camera.at = new Vector3([0,0,-100]);
    //g_camera.up = new Vector3([0, 1, 0]);

    var projMat = g_camera.proj;
    var viewMat = g_camera.view;
    var globalRotMat = new Matrix4().rotate(g_globalXAngle, 0, 1, 0);

    globalRotMat.rotate(g_globalYAngle, 1, 0, 0);

    projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 1000); //(fov, aspect, near, far)

    
        viewMat.setLookAt(
          g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2], 
          g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2], 
          g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]);
    
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  

  
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
let g_placeTexture = 1;
let g_normal = false;

let g_lightAni = false;
let g_lightOn = true;
let g_lightPos = [0,1,-2];
//let g_lightY = 100;
//let g_lightZ = -200;




function addActionsForHtmlUI(){

  
  document.getElementById('animationOnButton').onclick = function() {g_animation=true};
  document.getElementById('animationOffButton').onclick = function() {g_animation=false};

  document.getElementById('animationOnButton2').onclick = function() {g_animation2=true};
  document.getElementById('animationOffButton2').onclick = function() {g_animation2=false};

  document.getElementById('lightButtonOn').onclick = function() {g_lightOn=true; } //console.log(u_lightOn); };
  document.getElementById('lightButtonOff').onclick = function() {g_lightOn=false; } //console.log(u_lightOn);};
  
  document.getElementById('lightButtonMove').onclick = function() {g_lightAni=true};
  document.getElementById('lightButtonStop').onclick = function() {g_lightAni=false};

  document.getElementById('normalButtonOn').onclick = function() {g_normal=true};
  document.getElementById('normalButtonOff').onclick = function() {g_normal=false};

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
  

  document.getElementById('lightSlideX').addEventListener('mousemove', function() { g_lightPos[0] = this.value/100; renderAllShapes(); });
  document.getElementById('lightSlideY').addEventListener('mousemove', function() { g_lightPos[1] = this.value/100; renderAllShapes(); });
  document.getElementById('lightSlideZ').addEventListener('mousemove', function() { g_lightPos[2] = this.value/100; renderAllShapes(); });
  
  
  
  //Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  //document.getElementById('alphaSlide').addEventListener('mouseup', function() { g_selectedAlpha = this.value; });

  document.addEventListener('mousedown', function(ev) { if (ev.shiftKey) {shiftKey();}  });
}

//book functions for UV

function initTextures() {
  
  //night sky
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToTEXTURE0(image); };
  // Tell the browser to load an image
  image.src = '../textures/night_sky.webp';

  //dirt
  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToTEXTURE1(image2); };
  // Tell the browser to load an image
  image2.src = '../textures/dirt_texture.jpg';

  //wood
  var image3 = new Image();  // Create the image object
  if (!image3) {
    console.log('Failed to create the image3 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image3.onload = function(){ sendTextureToTEXTURE2(image3); };
  // Tell the browser to load an image
  image3.src = '../textures/wood.jpg';

  //plank
  var image4 = new Image();  // Create the image object
  if (!image4) {
    console.log('Failed to create the image4 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image4.onload = function(){ sendTextureToTEXTURE3(image4); };
  // Tell the browser to load an image
  image4.src = '../textures/plank.jpg';

  //cobble
  var image5 = new Image();  // Create the image object
  if (!image5) {
    console.log('Failed to create the image5 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image5.onload = function(){ sendTextureToTEXTURE4(image5); };
  // Tell the browser to load an image
  image5.src = '../textures/cobble_stone.png';

  var image6 = new Image();  // Create the image object
  if (!image6) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image6.onload = function(){ sendTextureToTEXTURE5(image6); };
  // Tell the browser to load an image
  image6.src = '../textures/door_top.png';

  var image7 = new Image();  // Create the image object
  if (!image7) {
    console.log('Failed to create the image7 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image7.onload = function(){ sendTextureToTEXTURE6(image7); };
  // Tell the browser to load an image
  image7.src = '../textures/door_bottom.png';

  var image8 = new Image();  // Create the image object
  if (!image8) {
    console.log('Failed to create the image8 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image8.onload = function(){ sendTextureToTEXTURE7(image8); };
  // Tell the browser to load an image
  image8.src = '../textures/polished_andosite.png';

  var image9 = new Image();  // Create the image object
  if (!image9) {
    console.log('Failed to create the image9 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image9.onload = function(){ sendTextureToTEXTURE8(image9); };
  // Tell the browser to load an image
  image9.src = '../textures/water.jpeg';

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
  console.log("finished loadTexture0");
}

function sendTextureToTEXTURE1(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  console.log("finished loadTexture1");
}

function sendTextureToTEXTURE2(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);

  console.log("finished loadTexture2");
}

function sendTextureToTEXTURE3(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE3);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler3, 3);

  console.log("finished loadTexture3");
}

function sendTextureToTEXTURE4(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE4);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler4, 4);

  console.log("finished loadTexture4");
}

function sendTextureToTEXTURE5(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE5);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler5, 5);

  console.log("finished loadTexture5");
}

function sendTextureToTEXTURE6(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE6);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler6, 6);

  console.log("finished loadTexture6");
}

function sendTextureToTEXTURE7(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE7);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler7, 7);

  console.log("finished loadTexture7");
}

function sendTextureToTEXTURE8(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE8);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler8, 8);

  console.log("finished loadTexture8");
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

let g_firstClick = true;

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  //set up actions for HTML UI elements
  addActionsForHtmlUI();


  // Register function (event handler) to be called on a mouse press
  //canvas.mouseEvent.shiftKey = shiftclick;

  canvas.onmouseup = function() { g_firstClick = true };
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
    console.log("w");
    //console.log(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2], g_at.elements[0], g_at.elements[1], g_at.elements[2], g_up.elements[0], g_up.elements[1], g_up.elements[2]);
  } else 
  if (ev.keyCode == 65) { // a
    g_camera.left();
    console.log("a");
  } else 
  if (ev.keyCode == 83) { // s
    g_camera.back();
    console.log("s");
  } else 
  if (ev.keyCode == 68) { // d
    g_camera.right();
    console.log("d");
  } else
  if (ev.keyCode == 81) { // q
    g_camera.rotateLeft();
    console.log("q");
  } else
  if (ev.keyCode == 69) { // e
    g_camera.rotateRight();
    console.log("e");
  } else
  if (ev.keyCode == 74) { // j
    g_camera.placeblock();
    console.log("j");
  } else
  if (ev.keyCode == 75) { // k
    g_camera.deleteblock();
    console.log("k");
  } else
  //textures
  if (ev.keyCode == 49) { // 1
    g_placeTexture = 1;
    console.log("1");
  } else
  if (ev.keyCode == 50) { // 2
    g_placeTexture = 2;
    console.log("2");
  } else
  if (ev.keyCode == 51) { // 3
    g_placeTexture = 4;
    console.log("3");
  } else
  if (ev.keyCode == 52) { // 4
    g_placeTexture = 7;
    console.log("4");
  } else
  //up and down
  if (ev.keyCode == 32) { // space
    g_camera.eye.elements[1] += 0.25;
    g_camera.at.elements[1] += 0.25;
    console.log("space");
  } else
  if (ev.keyCode == 16) { // shift
    g_camera.eye.elements[1] -= 0.25;
    g_camera.at.elements[1] -= 0.25;
    if (g_camera.eye.elements[1] <= -1) {
      g_camera.eye.elements[1] = -1;
      g_camera.at.elements[1] = -1;
    }
    console.log("left shift");
  } else
  if (ev.keyCode == 73) { // I
    g_camera.eye.elements[1] += 0.25;
    g_camera.at.elements[1] += 0.25;
    console.log("I");
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

  if (g_lightAni) {
    var r = 3;
    g_lightPos[0] = r * Math.cos(g_seconds);
    g_lightPos[1] = r * Math.sin(g_seconds);
  }
}

/*
var g_eye = new Vector3();
g_eye.elements[0] = 0;
g_eye.elements[1] = 0;
g_eye.elements[2] = 0;
var g_at = new Vector3();
g_at.elements[0] = 0;
g_at.elements[1] = 0;
g_at.elements[2] = -1;
var g_up = new Vector3();
g_up.elements[0] = 0;
g_up.elements[1] = 1;
g_up.elements[2] = 0;
*/


//console.log(g_camera);


var g_map = [[4,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,5],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
];



function drawMap() {
  for (x=0; x<32; x++) {
    for (y=0; y<32; y++) {
      if (g_map[x][y] > 0) {
          for (loop=0; loop < g_map[x][y]; loop++) {
          var block = new Cube([1.0,1.0,1.0,1.0]);
          if (g_normal) { 
            block.textureNum = -3;
          } else {
            block.textureNum = g_placeTexture;
          }
          block.matrix.translate(0, -2, 0);
          block.matrix.scale(0.5,0.5,0.5);
          block.matrix.translate(x-16, loop+1, y-16);
          
          block.render();
        }
      }
    }
  }
}



function renderAllShapes() {

  //check the time at the start of this function
  var startTime = performance.now();

  //var texture = -3;

  //var xAngleRads = g_globalXAngle * Math.PI/180;

  var projMat = g_camera.proj;
  projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 1000); //(fov, aspect, near, far)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = g_camera.view;
  /*
  viewMat.setLookAt(
      g_eye[0],g_eye[1],g_eye[2], 
      g_at[0],g_at[1],g_at[2], 
      g_up[0],g_up[1],g_up[2]); // (eye, at, up);
      */

    //console.log("eye", g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
    //console.log("eyexyz", g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);
    
    //console.log(viewMat);
  viewMat.setLookAt(
        g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2], 
        g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2], 
        g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]); // (eye, at, up);

        //console.log(g_camera);
        //console.log(viewMat)
  
        //console.log("after update", viewMat);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalXAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalYAngle, 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //console.log("viewMat", viewMat.elements);
  //console.log("projMat", projMat.elements);
  //console.log("rotationMat", globalRotMat);

  

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  //Draw map
  //drawMap();

  //light
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1]-2, g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  gl.uniform1i(u_lightOn, g_lightOn);


  var light = new Cube([1,1,0,1]);
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1,-0.1,-0.1);
  light.textureNum = -2;
  light.render();

  var sphere = new Sphere([1.0,1.0,1.0,1.0]);
  if (g_normal) { 
    sphere.textureNum = -3;
  } else {
    sphere.textureNum = 4;
  }
  sphere.matrix.translate(0,0,-2);
  sphere.matrix.scale(0.5,0.5,0.5);
  sphere.render();


  //dock
  var floor = new Cube([0.0,1.0,0.0,1.0]);
  floor.textureNum = 2;
  
  floor.matrix.translate(0, -1.5, 0.0);
  floor.matrix.translate(-2.5, 0.01, 16);
  floor.matrix.scale(4, 0.02, 4);
  floor.render();

  //rail
  for (z = 12.5; z < 16.5; z += 0.5) {
    var rail = new Cube([0.0,1.0,0.0,1.0]);
    if (g_normal) { 
      rail.textureNum = -3;
    } else {
      rail.textureNum = 2;
    }
    rail.matrix.translate(0, -1.5, 0.0);
    rail.matrix.translate(-2.5, 0.01, z);
    rail.matrix.scale(0.5, 0.5, 0.5);
    rail.render();
  }

  //rail
  for (z = 12.5; z < 16.5; z += 0.5) {
    var rail = new Cube([0.0,1.0,0.0,1.0]);
    if (g_normal) { 
      rail.textureNum = -3;
    } else {
      rail.textureNum = 2;
    }
    rail.matrix.translate(0, -1.5, 0.0);
    rail.matrix.translate(1, 0.01, z);
    rail.matrix.scale(0.5, 0.5, 0.5);
    rail.render();
  }


  //Draw the floor
  var floor = new Cube([0.0,0.5,0.0,1.0]);
  if (g_normal) { 
    floor.textureNum = -3;
  } else {
    floor.textureNum = -2;
  }
  floor.matrix.translate(0, -1.5, 0.0);
  floor.matrix.translate(-16, 0.01, 16);
  floor.matrix.scale(32, 0, 32);
  floor.render();

  //draw the sky
  var sky = new Cube([0.0, 0.0, 1.0, 1.0]);
  if (g_normal) { 
    sky.textureNum = -3;
  } else {
    sky.textureNum = 0;
  }
  sky.matrix.translate(25, 15, -25);
  sky.matrix.scale(-50,-50,-50);
  sky.render();

  //fountain base
  var fbase = new Cube([0.0,1.0,0.0,1.0]);
  fbase.textureNum = 7;
  fbase.matrix.translate(0, -1.5, 0.0);
  fbase.matrix.translate(-1, 0, 1.25);
  fbase.matrix.scale(1.99, 0.05, 1.99);
  fbase.render();

  //fountain front base
  for (x = -1; x < 1; x += 0.25) {
    var ffbase = new Cube([0.0,1.0,0.0,1.0]);
    ffbase.textureNum = 7;
    if (g_normal) { 
      ffbase.textureNum = -3;
    } else {
      ffbase.textureNum = 7;
    }
    ffbase.matrix.translate(0, -1.5, 0.0);
    ffbase.matrix.translate(x, 0, -0.5);
    ffbase.matrix.scale(0.25, 0.25, 0.25);
    ffbase.render();
  }

  //fountain back base
  for (x = -1; x < 1; x += 0.25) {
    var ffbase = new Cube([0.0,1.0,0.0,1.0]);
    if (g_normal) { 
      ffbase.textureNum = -3;
    } else {
      ffbase.textureNum = 7;
    }
    ffbase.matrix.translate(0, -1.5, 0.0);
    ffbase.matrix.translate(x, 0, 1.25);
    ffbase.matrix.scale(0.25, 0.25, 0.25);
    ffbase.render();
  }

  //fountain right side base
  for (z = -0.25; z < 1.25; z += 0.25) {
    var ffbase = new Cube([0.0,1.0,0.0,1.0]);
    ffbase.textureNum = 7;
    ffbase.matrix.translate(0, -1.5, 0.0);
    ffbase.matrix.translate(-1, 0, z);
    ffbase.matrix.scale(0.25, 0.25, 0.25);
    ffbase.render();
  }

  //fountain left side base
  for (z = -0.25; z < 1.25; z += 0.25) {
    var ffbase = new Cube([0.0,1.0,0.0,1.0]);
    ffbase.textureNum = 7;
    ffbase.matrix.translate(0, -1.5, 0.0);
    ffbase.matrix.translate(0.75, 0, z);
    ffbase.matrix.scale(0.25, 0.25, 0.25);
    ffbase.render();
  }

  //fountain column
  var col = new Cube([0.0,1.0,0.0,1.0]);
  col.textureNum = 7;
  col.matrix.translate(-0.25, -1.5, 0.5);
  //col.matrix.translate(0.75, 0, z);
  col.matrix.scale(0.5, 0.75, 0.5);
  col.render();

  //water
  var water = new Cube([0.0,0.0,0.7,0.7]);
  water.textureNum = -2;
  water.matrix.translate(0, -1.5, 0.0);
  water.matrix.translate(-1, 0, 1.25);
  water.matrix.scale(1.79, 0.15, 1.79);
  water.render();

  //ocean
  var ocean = new Cube([0.0,0.0,0.9,1.0]);
  ocean.textureNum = -2;
  ocean.matrix.translate(0, -1.5, 0.0);
  ocean.matrix.translate(-40, 0, 40);
  ocean.matrix.scale(80, 0, 80);
  ocean.render();



  //house
  
  var octbody = new Octagon3d([1.0,0.0,1.0,1.0]);
  octbody.matrix.translate(-0.2,-0.75,-0.25);
  octbody.textureNum = 7;
  octbody.render();
  
  
  var neck = new Cube([0.9,0.0,0.9,1.0]);
  neck.matrix.translate(-0.05,-0.4,0.30);
  neck.matrix.scale(0.1,0.3,0.1);
  neck.textureNum = 7;
  neck.render();

  var head = new Cube([0.9,0.0,0.9,1.0]);
  head.matrix.translate(-0.25,-0.20,0.5);
  head.matrix.scale(0.5,0.5,0.5);
  head.textureNum = 7;
  head.render();

  var leftEye = new Cube([1.0,1.0,1.0,1.0]);
  leftEye.matrix.translate(-0.15,0.07,0.05);
  leftEye.matrix.scale(0.1,0.1,0.1);
  leftEye.textureNum = 7;
  leftEye.render();

  var leftPuple = new Cube([0.0,0.0,0.0,1.0]);
  leftPuple.matrix.translate(-0.1,0.11,0.04);
  leftPuple.matrix.scale(0.02,0.02,0.1);
  leftPuple.textureNum = 7;
  leftPuple.render();

  var rightEye = new Cube([1.0,1.0,1.0,1.0]);
  rightEye.matrix.translate(0.05,0.07,0.05);
  rightEye.matrix.scale(0.1,0.1,0.1);
  rightEye.textureNum = 7;
  rightEye.render();

  var rightPuple = new Cube([0.0,0.0,0.0,1.0]);
  rightPuple.matrix.translate(0.1,0.11,0.04);
  rightPuple.matrix.scale(0.02,0.02,0.1);
  rightPuple.textureNum = 7;
  rightPuple.render();

  var mouth = new Cube([0.1,0.1,0.1,1.0]);
  mouth.matrix.translate(-0.05,-0.1,0.10);
  mouth.matrix.scale(0.1*g_msize,0.1*g_msize,0.11);
  mouth.textureNum = 7;
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
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
  tip.render();


  //leg 2

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg2x,legy,leg2z);
  base.matrix.rotate(leg2yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
  tip.render();

  //leg 3

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg3x,legy,leg3z);
  base.matrix.rotate(leg3yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
  tip.render();

  //leg 4

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg4x,legy,leg4z);
  base.matrix.rotate(leg4yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
  tip.render();

  //leg5

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg5x,legy,leg5z);
  base.matrix.rotate(leg5yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
  tip.render();

  //leg6

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg6x,legy,leg6z);
  base.matrix.rotate(leg6yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
  tip.render();

  //leg7

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg7x,legy,leg7z);
  base.matrix.rotate(leg7yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
  tip.render();

  //leg8

  //draw the cube body
  var base = new Cube([1.0,0.0,1.0,1.0]);
  base.matrix.translate(leg8x,legy,leg8z);
  base.matrix.rotate(leg8yrot,0,1,0);
  var baseCoordingatesMat = new Matrix4(base.matrix);

  base.matrix.scale(0.5*xarmscale, 0.3*yarmscale, zarmscale);
  base.textureNum = 7;
  base.normalMatrix.setInverseOf(base.matrix).transpose();
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
  longArm.matrix.translate(-0.5,0,0);
  longArm.textureNum = 7;
  longArm.normalMatrix.setInverseOf(longArm.matrix).transpose();
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
  short.textureNum = 7;
  short.normalMatrix.setInverseOf(short.matrix).transpose();
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
  tip.textureNum = 7;
  tip.normalMatrix.setInverseOf(tip.matrix).transpose();
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


var g_x;
var g_y;

function click(ev) {

  //extract the event click and return it in WebGL coordinates
  var x2;
  var y2;
  var delta_x;
  var delta_y;
  if (g_firstClick == true) {
    [g_x,g_y] = convertCorrdinatesEventToGL(ev);
    console.log(g_x, g_y);
  }

  [x2,y2] = convertCorrdinatesEventToGL(ev);

  delta_x = x2-g_x;
  delta_y = y2-g_y;

  g_firstClick = false;


  console.log(delta_x, delta_y);

  //console.log("click on ", x, y);

  g_camera.xAngle = 1;

  if (delta_x <=0) {
    g_camera.rotateLeft();
  } else {
    g_camera.rotateRight();
  }


  g_camera.xAngle = 5;

  //var mousesense = 7;

  //g_globalXAngle += delta_x*mousesense;
  //g_globalYAngle += delta_y*mousesense;
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
