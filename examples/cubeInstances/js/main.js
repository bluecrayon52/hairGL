/// <reference path="../../../node_modules/gl-matrix/dist/gl-matrix-min.js"/>


document.addEventListener("DOMContentLoaded", start);
var gl;

// object oriented encapsulation of a cube 
function createCube(){

    var cube ={};

    cube.vertices = [
        -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,    0.5, 0.5, -0.5,     0.5, 0.5, -0.5,     -0.5, 0.5, -0.5,    -0.5, -0.5, -0.5,

        -0.5, -0.5, 0.5,    0.5, -0.5, 0.5,     0.5, 0.5, 0.5,      0.5, 0.5, 0.5,      -0.5, 0.5, 0.5,     -0.5, -0.5, 0.5,

        -0.5, 0.5, 0.5,     -0.5, 0.5, -0.5,    -0.5, -0.5, -0.5,   -0.5, -0.5, -0.5,   -0.5, -0.5, 0.5,    -0.5, 0.5, 0.5,

        0.5, 0.5, 0.5,      0.5, 0.5, -0.5,     0.5, -0.5, -0.5,    0.5, -0.5, -0.5,    0.5, -0.5, 0.5,     0.5, 0.5, 0.5,

        -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,    0.5, -0.5, 0.5,     0.5, -0.5, 0.5,     -0.5, -0.5, 0.5,    -0.5, -0.5, -0.5,

        -0.5, 0.5, -0.5,    0.5, 0.5, -0.5,     0.5, 0.5, 0.5,      0.5, 0.5, 0.5,      -0.5, 0.5, 0.5,     -0.5, 0.5, -0.5,
    ]

    // on the GPU
    cube.positionBuffer = gl.createBuffer(); 

    // Gate between CPU and GPU 
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertices), gl.STATIC_DRAW);

    cube.vertexShader = getAndCompileShader("vertexShader");
    cube.fragmentShader = getAndCompileShader("fragmentShader");
    cube.shaderProgram = gl.createProgram();

    gl.attachShader(cube.shaderProgram, cube.vertexShader);
    gl.attachShader(cube.shaderProgram, cube.fragmentShader);
    gl.linkProgram(cube.shaderProgram);

    if (!gl.getProgramParameter(cube.shaderProgram, gl.LINK_STATUS)){
        alert("Could not link shaders");
    }

    gl.useProgram(cube.shaderProgram);

    cube.vao = gl.createVertexArray();
    gl.bindVertexArray(cube.vao);

    cube.positionAttributeLocation = gl.getAttribLocation(cube.shaderProgram, "position");
    gl.enableVertexAttribArray(cube.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(cube.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    
    cube.modelMatrix = mat4.create();
    cube.modelMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "modelMatrix", );

    return cube; 
}

function start(){

    console.log("hello from the Cube Instances");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    var cube = createCube();

    var uniformColorsArray = [];
    var color = vec4.fromValues(1, 0, 0, 1); // red
    uniformColorsArray.push(color); 
    color = vec4.fromValues(0, 1, 0, 1); // green
    uniformColorsArray.push(color); 
    color = vec4.fromValues(0, 0, 1, 1); // blue
    uniformColorsArray.push(color); 

    var offsetsVector = vec3.fromValues(-2, 0, 2); // offsets for each cube in the x dir only

    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();

    // make a camera 
    mat4.perspective(projectionMatrix, 45*Math.PI/180.0, canvas.width/canvas.height, 0.1, 30); 
    requestAnimationFrame(runRenderLoop);

    var viewMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "viewMatrix", );
    var projectionMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "projectionMatrix", );

    var colorsUniformArrayLocation0 = gl.getUniformLocation(cube.shaderProgram, "colorsUniformArray[0]");
    var colorsUniformArrayLocation1 = gl.getUniformLocation(cube.shaderProgram, "colorsUniformArray[1]");
    var colorsUniformArrayLocation2 = gl.getUniformLocation(cube.shaderProgram, "colorsUniformArray[2]");

    var offsetUniformLocation = gl.getUniformLocation(cube.shaderProgram, "offsets"); 
    var timeUniformLocation = gl.getUniformLocation(cube.shaderProgram, "time"); 

    // var angle = .1; // define the increment of rotation 
    var angle = 0;  // another way of incrementing the angle
    var currentTime = 0; 
    function runRenderLoop(){
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);

        // --------------First Cube------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, 0, -6]);  // LEFT and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
        angle += 0.02;    // another way of incrementing the angle
        currentTime += 0.02; // increase time for color change

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(colorsUniformArrayLocation0, uniformColorsArray[0]); // vector of four floats
        gl.uniform4fv(colorsUniformArrayLocation1, uniformColorsArray[1]); // vector of four floats
        gl.uniform4fv(colorsUniformArrayLocation2, uniformColorsArray[2]); // vector of four floats

        gl.uniform3fv(offsetUniformLocation, offsetsVector); // vector of three floats

        gl.uniform1f(timeUniformLocation, currentTime);

   
        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 3);  // 3 instances 
        
        requestAnimationFrame(runRenderLoop);
    }

}

function getAndCompileShader(id){

    var shader; 
    var shaderElement = document.getElementById(id);
    console.log("shader Element is ::"+ shaderElement);
    var shaderText = shaderElement.text.trim(); 

    if(id=="vertexShader")
        shader = gl.createShader(gl.VERTEX_SHADER);
    else if (id =="fragmentShader")
        shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(shader));
        return null; 
    }

    return shader; 
}