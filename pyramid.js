window.onload = function init() {
  // WebGL canvas context
  var gl = canvas.getContext('webgl');

  // Vertex shader
  var vshader = `
attribute vec4 position; 
attribute vec4 color;
attribute vec3 normal;
uniform mat4 camera;
uniform vec3 lightColor;
uniform vec3 lightDirection;
uniform vec3 ambientLight;
varying vec4 v_color;
void main() {

  // Apply the camera matrix to the vertex position
  gl_Position = camera * position;
  
  // Compute angle between the normal and that direction
  float nDotL = max(dot(lightDirection, normalize(normal)), 0.0);
  
  // Compute diffuse light proportional to this angle
  vec3 diffuse = lightColor * color.rgb * nDotL;
  
  // Compute ambient light
  vec3 ambient = ambientLight * color.rgb;
  
  // Set varying color
  v_color = vec4(diffuse + ambient, 1.0);
}`;
  // Fragment shader
  var fshader = `
precision mediump float;
varying vec4 v_color;
void main() {
  gl_FragColor = v_color;
}`;

  // Compile program
  var program = compile(gl, vshader, fshader);
  //Create Pyramid 

  var vertices, normals, indices;
  [vertices, normals, indices] = pyramid();

  // Colors
  var colors = new Float32Array([
    0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, // front (purple)
    0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, // right (green)
    1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, // up    (red)
    1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, // left  (yellow)
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // down  (white)
    0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0  // back  (blue)
  ]);


  var n = 18;

  // Set position and color
  buffer(gl, vertices, program, 'position', 3, gl.FLOAT);
  buffer(gl, colors, program, 'color', 3, gl.FLOAT);

  // Set indices
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);


  //Declaring the Variables 
  var fovValue = 10;
  var Ty = -0.1;
  var Tx = 0;
  var Rx = 0;
  var Ry = 0;
  var Rz = 0;
  var alv = 1;
  //********************** FOV Slider ********************************************* */
  render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);

  document.getElementById("fovSlider").onclick = function () {
    fovValue = document.getElementById("fovSlider").value;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };
  //********************** Light Slider ********************************************* */
  document.getElementById("lightSlider").onclick = function () {
    alv = document.getElementById("lightSlider").value;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };

  //********************** Translation ********************************************* */

  //Y axis Translation

  document.getElementById("moveUP").onclick = function () {
    Ty += 0.1;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };

  document.getElementById("moveDOWN").onclick = function () {
    Ty -= 0.1;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };

  // X axis Translation

  document.getElementById("moveLeft").onclick = function () {
    Tx += 0.1;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };


  document.getElementById("moveRight").onclick = function () {
    Tx -= 0.1;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };


  //********************** Rotation ********************************************* */
  document.getElementById("xRotation").onclick = function () {
    Rx += 1;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };

  document.getElementById("yRotation").onclick = function () {
    Ry += 1;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };

  document.getElementById("zRotation").onclick = function () {
    Rz += 1;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };
  //********************** Animation ********************************************* */

  //BUTTON START ANIMATION WITH INFINITE ROTATIION ANIMATION
  /*
  By clicking on stopanimation it clears Animation loop interval and renders a static triangle
  */
  isAnimationRunning = null;

  document.getElementById("stopAnimation").onclick = function () {
    clearInterval(animationInterval);
    //Rz += 1;   
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };


  document.getElementById("startAnimation").onclick = function () {
    if (isAnimationRunning) {
      clearInterval(animationInterval);
    }
    Ry += 0.5;
    Rx += 0.5;
    Rz += 0.5;
    isAnimationRunning = true;
    animate(Tx, Ty, fovValue, Rx, Rz, Ry);
  };

  function animate(Tx, Ty, fovValue, Rx, Rz, Ry) {

    var cameraMatrix = perspective({ fov: fovValue, aspect: 1, near: 1, far: 100 });
    cameraMatrix.translateSelf(Tx, Ty, -5).rotateSelf(Rx, Ry, Rz);
    var camera = gl.getUniformLocation(program, 'camera');
    gl.uniformMatrix4fv(camera, false, cameraMatrix.toFloat32Array());

    // Set the diffuse light color and direction
    var lightColor = gl.getUniformLocation(program, 'lightColor');
    gl.uniform3f(lightColor, 1, 1, 1);
    var lightDirection = gl.getUniformLocation(program, 'lightDirection');
    gl.uniform3f(lightDirection, 0.1, 0.6, 0.8);

    // Set the ambient light color
    var ambientLight = gl.getUniformLocation(program, 'ambientLight');
    gl.uniform3f(ambientLight, 1, 1, 1);

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

    //ANIMATE

    animationInterval = setInterval(() => {
      cameraMatrix.rotateSelf(Rx, Ry, Rz);
      gl.uniformMatrix4fv(camera, false, cameraMatrix.toFloat32Array());
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
    }, 16);

  }

  //********************** Projection ********************************************* */
  document.getElementById("view1").onclick = function () {
    var Rx = 0;
    var Ry = 0;
    var Rz = 0;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };

  document.getElementById("view2").onclick = function () {
    var Rx = 20;
    var Ry = 20;
    var Rz = 0;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };
  document.getElementById("view3").onclick = function () {
    var Rx = 90;
    var Ry = 10;
    var Rz = 0;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };
  document.getElementById("view4").onclick = function () {
    var Rx = 0;
    var Ry = 50;
    var Rz = 0;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };
  document.getElementById("view5").onclick = function () {
    var Rx = 14;
    var Ry = 0;
    var Rz = 0;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };
  document.getElementById("view6").onclick = function () {
    var Rx = -40;
    var Ry = 40;
    var Rz = 0;
    render(Tx, Ty, fovValue, Rx, Rz, Ry, alv);
  };

  //********************** Render Function ********************************************* */
  function render(Tx, Ty, fovValue, Rx, Rz, Ry, alv) {

    var cameraMatrix = perspective({ fov: fovValue, aspect: 1, near: 1, far: 100 });
    cameraMatrix.translateSelf(Tx, Ty, -5).rotateSelf(Rx, Ry, Rz);
    var camera = gl.getUniformLocation(program, 'camera');
    gl.uniformMatrix4fv(camera, false, cameraMatrix.toFloat32Array());

    // Set the diffuse light color and direction
    var lightColor = gl.getUniformLocation(program, 'lightColor');
    gl.uniform3f(lightColor, 1, 1, 1);
    var lightDirection = gl.getUniformLocation(program, 'lightDirection');
    gl.uniform3f(lightDirection, 0.1, 0.6, 0.8);

    // Set the ambient light color
    var ambientLight = gl.getUniformLocation(program, 'ambientLight');
    gl.uniform3f(ambientLight, alv, alv, alv);

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

  }
}
