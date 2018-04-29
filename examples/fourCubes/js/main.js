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

    // rgba values
    var faceColors = [
        [1.0, 0.0, 0.0, 1.0],   // front face 
        [0.0, 1.0, 0.0, 1.0],   // back face 
        [0.0, 0.0, 1.0, 1.0],   // tope face 
        [1.0, 1.0, 0.0, 1.0],   // bottom face 
        [1.0, 0.0, 1.0, 1.0],   // right face 
        [0.0, 1.0, 1.0, 1.0]    // left face 
    ];

     // on the CPU
    cube.colors = [];

    // cannot pass face colors to GBU 
    // loop over colors and assign to vertices 
    faceColors.forEach((color)=>{
        for(var i = 0; i < 6; i++){
            cube.colors = cube.colors.concat(color);
        }
    });

    // on the GPU
    cube.colorBuffer = gl.createBuffer(); 

    // Gate between the CPU and GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.colors), gl.STATIC_DRAW);


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

    cube.colorAttributeLocation = gl.getAttribLocation(cube.shaderProgram, "color");
    gl.enableVertexAttribArray(cube.colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(cube.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    cube.modelMatrix = mat4.create();
    cube.modelMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "modelMatrix", );

    return cube; 
}

function start(){

    console.log("hello from the Cube");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    var cube = createCube();

    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();

    // make a camera 
    mat4.perspective(projectionMatrix, 45*Math.PI/180.0, canvas.width/canvas.height, 0.1, 30); 
    requestAnimationFrame(runRenderLoop);

    var viewMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "viewMatrix", );
    var projectionMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "projectionMatrix", );

    // var angle = .1; // define the increment of rotation 
    var angle = 0;  // another way of incrementing the angle
    
    function runRenderLoop(){
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);

        // --------------First Cube------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [-1, 0, -4]);  // LEFT and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
        angle += 0.01;    // another way of incrementing the angle

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points
        
        // --------------Second Cube------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, 0, -8]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
        angle += 0.01;    // another way of incrementing the angle

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points

         // --------------Third Cube------------------------------------------------------------------------------------ 
         mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

         mat4.translate(cube.modelMatrix, cube.modelMatrix, [2, 0, -16]);  // RIGHT and push cube away from camera in negative z direction 
         mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
         mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
         angle += 0.01;    // another way of incrementing the angle
 
         gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
         gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
         gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);
 
         gl.useProgram(cube.shaderProgram);
         gl.bindVertexArray(cube.vao);
         gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points

         // --------------Fourth Cube------------------------------------------------------------------------------------ 
         mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

         mat4.translate(cube.modelMatrix, cube.modelMatrix, [4.5, 0, -22]);  // RIGHT and push cube away from camera in negative z direction 
         mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
         mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
         angle += 0.01;    // another way of incrementing the angle
 
         gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
         gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
         gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);
 
         gl.useProgram(cube.shaderProgram);
         gl.bindVertexArray(cube.vao);
         gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points
 

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