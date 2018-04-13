/// <reference path="../../../node_modules/gl-matrix/dist/gl-matrix-min.js"/>


document.addEventListener("DOMContentLoaded", start);
var gl;

function start(){

    console.log("hello from the Cube");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    // on the CPU
    var vertices = [
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,

        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,

        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,

        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,

        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
  
    ]
    
    // on the GPU
    var positionBuffer = gl.createBuffer(); 

    // Gate between CPU and GPU 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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
    var colors = [];

    // cannot pass face colors to GBU 
    // loop over colors and assign to vertices 
    faceColors.forEach((color)=>{
        for(var i = 0; i < 6; i++){
            colors = colors.concat(color);
        }
    });

    // on the GPU
    var colorBuffer = gl.createBuffer(); 

    // Gate between the CPU and GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    var vertexShader = getAndCompileShader("vertexShader");
    var fragmentShader = getAndCompileShader("fragmentShader");
    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert("Could not link shaders");
    }

    gl.useProgram(shaderProgram);

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    var projectionMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var modelMatrix = mat4.create(); 

    // make a camera 
    mat4.perspective(projectionMatrix, 45*Math.PI/180.0, canvas.width/canvas.height, 0.1, 10); 
    requestAnimationFrame(runRenderLoop);

    var projectionMatrixLocation = gl.getUniformLocation(shaderProgram, "projectionMatrix", );
    var viewMatrixLocation = gl.getUniformLocation(shaderProgram, "viewMatrix", );
    var modelMatrixLocation = gl.getUniformLocation(shaderProgram, "modelMatrix", );

    // var angle = .1; // define the increment of rotation 
    var angle = 0;  // another way of incrementing the angle
    
    function runRenderLoop(){
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);

        mat4.identity(modelMatrix);   // another way of incrementing the angle

        mat4.translate(modelMatrix, modelMatrix, [0, 0, -5]);  // push cube away from camera in negative z direction 
        mat4.rotateY(modelMatrix, modelMatrix, angle);
        mat4.rotateX(modelMatrix, modelMatrix, angle/8);
        angle += 0.1;    // another way of incrementing the angle

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

        gl.useProgram(shaderProgram);
        gl.bindVertexArray(vao);
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