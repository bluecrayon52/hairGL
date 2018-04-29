/// <reference path="../../../node_modules/gl-matrix/dist/gl-matrix-min.js"/>


document.addEventListener("DOMContentLoaded", start);
var gl;

// object oriented encapsulation of a rectangle
function createRectangle(){

    var rectangle ={};

    // only unique vertices [0, 1, 2, 3]
    rectangle.vertices = [
        -1, -1, 0,     1, -1, 0,      1, 1, 0,      -1, 1, 0
    ];

    // reference the unique vertices 
    rectangle.indices = [ 0, 1, 2, 0, 2, 3];


     // on the CPU
     // red for all six vertices 
    rectangle.colors = [ 
        1, 0, 0, 1,     1, 0, 0, 1,     1, 0, 0, 1,     1, 0, 0, 1
    ];

    // bind vao before using the indices array 
    rectangle.vao = gl.createVertexArray();
    gl.bindVertexArray(rectangle.vao);

    // on the GPU
    rectangle.positionBuffer = gl.createBuffer(); 

    // Gate between CPU and GPU 
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.positionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangle.vertices), gl.STATIC_DRAW);

    // on the GPU
    rectangle.colorBuffer = gl.createBuffer(); 

    // Gate between the CPU and GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangle.colors), gl.STATIC_DRAW);

    // on the GPU
    rectangle.indicesBuffer = gl.createBuffer();

    // a second Gate berween the CPU and GPU 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangle.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rectangle.indices), gl.STATIC_DRAW); 


    rectangle.vertexShader = getAndCompileShader("vertexShader");
    rectangle.fragmentShader = getAndCompileShader("fragmentShader");
    rectangle.shaderProgram = gl.createProgram();

    gl.attachShader(rectangle.shaderProgram, rectangle.vertexShader);
    gl.attachShader(rectangle.shaderProgram, rectangle.fragmentShader);
    gl.linkProgram(rectangle.shaderProgram);

    if (!gl.getProgramParameter(rectangle.shaderProgram, gl.LINK_STATUS)){
        alert("Could not link shaders");
    }

    gl.useProgram(rectangle.shaderProgram);

    rectangle.positionAttributeLocation = gl.getAttribLocation(rectangle.shaderProgram, "position");
    gl.enableVertexAttribArray(rectangle.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.positionBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(rectangle.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    rectangle.colorAttributeLocation = gl.getAttribLocation(rectangle.shaderProgram, "color");
    gl.enableVertexAttribArray(rectangle.colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle.colorBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(rectangle.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    rectangle.modelMatrix = mat4.create();
    rectangle.modelMatrixLocation = gl.getUniformLocation(rectangle.shaderProgram, "modelMatrix", );

    return rectangle; 
}

function start(){

    console.log("hello from the Rectangle");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    var rectangle = createRectangle();

    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();

    // make a camera 
    mat4.perspective(projectionMatrix, 45*Math.PI/180.0, canvas.width/canvas.height, 0.1, 30); 
    requestAnimationFrame(runRenderLoop);

    var viewMatrixLocation = gl.getUniformLocation(rectangle.shaderProgram, "viewMatrix", );
    var projectionMatrixLocation = gl.getUniformLocation(rectangle.shaderProgram, "projectionMatrix", );

    // var angle = .1; // define the increment of rotation 
    var angle = 0;  // another way of incrementing the angle
    
    function runRenderLoop(){
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);

        // --------------First Rectangle------------------------------------------------------------------------------------ 
        mat4.identity(rectangle.modelMatrix);   // another way of incrementing the angle

        mat4.translate(rectangle.modelMatrix, rectangle.modelMatrix, [-1, 0, -4]);  // LEFT and push rectangle away from camera in negative z direction 
        mat4.rotateY(rectangle.modelMatrix, rectangle.modelMatrix, angle);
        mat4.rotateX(rectangle.modelMatrix, rectangle.modelMatrix, angle/8);
        angle += 0.01;    // another way of incrementing the angle

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(rectangle.modelMatrixLocation, false, rectangle.modelMatrix);

        gl.useProgram(rectangle.shaderProgram);
        gl.bindVertexArray(rectangle.vao);
        // gl.drawArrays(gl.TRIANGLES, 0, 6); // rendering 6 points

        // void gl.drawElements(mode, count, type, offset)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        
        // --------------Second Rectangle------------------------------------------------------------------------------------ 
        mat4.identity(rectangle.modelMatrix);   // another way of incrementing the angle

        mat4.translate(rectangle.modelMatrix, rectangle.modelMatrix, [0, 0, -8]);  // MIDDLE and push rectangle away from camera in negative z direction 
        mat4.rotateY(rectangle.modelMatrix, rectangle.modelMatrix, angle);
        mat4.rotateX(rectangle.modelMatrix, rectangle.modelMatrix, angle/8);
        angle += 0.01;    // another way of incrementing the angle

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(rectangle.modelMatrixLocation, false, rectangle.modelMatrix);

        gl.useProgram(rectangle.shaderProgram);
        gl.bindVertexArray(rectangle.vao);
        // gl.drawArrays(gl.TRIANGLES, 0, 6); // rendering 6 points

        // void gl.drawElements(mode, count, type, offset)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

         // --------------Third Rectangle------------------------------------------------------------------------------------ 
         mat4.identity(rectangle.modelMatrix);   // another way of incrementing the angle

         mat4.translate(rectangle.modelMatrix, rectangle.modelMatrix, [2, 0, -16]);  // RIGHT and push rectangle away from camera in negative z direction 
         mat4.rotateY(rectangle.modelMatrix, rectangle.modelMatrix, angle);
         mat4.rotateX(rectangle.modelMatrix, rectangle.modelMatrix, angle/8);
         angle += 0.01;    // another way of incrementing the angle
 
         gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
         gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
         gl.uniformMatrix4fv(rectangle.modelMatrixLocation, false, rectangle.modelMatrix);
 
         gl.useProgram(rectangle.shaderProgram);
         gl.bindVertexArray(rectangle.vao);
        //  gl.drawArrays(gl.TRIANGLES, 0, 6); // rendering 6 points

        // void gl.drawElements(mode, count, type, offset)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

         // --------------Fourth Rectangle------------------------------------------------------------------------------------ 
         mat4.identity(rectangle.modelMatrix);   // another way of incrementing the angle

         mat4.translate(rectangle.modelMatrix, rectangle.modelMatrix, [4.5, 0, -22]);  // RIGHT and push rectangle away from camera in negative z direction 
         mat4.rotateY(rectangle.modelMatrix, rectangle.modelMatrix, angle);
         mat4.rotateX(rectangle.modelMatrix, rectangle.modelMatrix, angle/8);
         angle += 0.01;    // another way of incrementing the angle
 
         gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
         gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
         gl.uniformMatrix4fv(rectangle.modelMatrixLocation, false, rectangle.modelMatrix);
 
         gl.useProgram(rectangle.shaderProgram);
         gl.bindVertexArray(rectangle.vao);
        //  gl.drawArrays(gl.TRIANGLES, 0, 6); // rendering 6 points

        // void gl.drawElements(mode, count, type, offset)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
 
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