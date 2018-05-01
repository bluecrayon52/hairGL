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

    cube.textureCoordinates = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        1.0, 0.0, 
        1.0, 1.0,
        0.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0, 

        1.0, 0.0, 
        1.0, 1.0,
        0.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,

        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
    ];

    // on the GPU
    cube.positionBuffer = gl.createBuffer(); 
    // Gate between CPU and GPU 
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertices), gl.STATIC_DRAW);

    // on GPU 
    cube.textureCoordinatesBuffer = gl.createBuffer(); 
    // Gate between the CPU and GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.textureCoordinatesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.textureCoordinates), gl.STATIC_DRAW); 

    //----------------------------------------TEXTURE 1-------------------------------------------------//
    cube.texture1 = gl.createTexture(); 
    cube.texture1.image = new Image(); 
    cube.texture1.image.src = "/images/windows_512.jpg";

    // overwrite onload function
    cube.texture1.image.onload = () => {

        // yet another Gate hath opened 
        gl.bindTexture( gl.TEXTURE_2D, cube.texture1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cube.texture1.image); 

        // used to select pixel matching when there is not a 1 to 1 ratio
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); 
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); 

         // another option used to select pixel matching when there is not a 1 to 1 ratio
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);    
    } 

    cube.vertexShader = getAndCompileShader("vertexShader");
    cube.fragmentShader = getAndCompileShader("fragmentShader");
    cube.shaderProgram = gl.createProgram();

    gl.attachShader(cube.shaderProgram, cube.vertexShader);
    gl.attachShader(cube.shaderProgram, cube.fragmentShader);
    gl.linkProgram(cube.shaderProgram);

    if (!gl.getProgramParameter(cube.shaderProgram, gl.LINK_STATUS)){
        alert("Could not link shaders");
    }

    cube.vao = gl.createVertexArray();
    gl.bindVertexArray(cube.vao);

    cube.positionAttributeLocation = gl.getAttribLocation(cube.shaderProgram, "position");
    gl.enableVertexAttribArray(cube.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(cube.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    cube.textureCoordinateAttributeLocation = gl.getAttribLocation(cube.shaderProgram, "textureCoordinate1");
    gl.enableVertexAttribArray(cube.textureCoordinateAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.textureCoordinatesBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(cube.textureCoordinateAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    cube.modelMatrix = mat4.create();
    cube.modelMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "modelMatrix");

    cube.samplerUniformLocation = gl.getUniformLocation(cube.shaderProgram, "sampler1");

    gl.useProgram(cube.shaderProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cube.texture1);
    gl.uniform1i(cube.samplerUniformLocation, 0); // move this line inside the loop if using multiple textures

    return cube; 
}

function start(){

    console.log("hello from the Cube Camera");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    var cube = createCube();

    var offsetsVector = vec4.fromValues(-1, 0, 1, 2); 

    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();

    // make perspective view (last perameter is far plane)
    mat4.perspective(projectionMatrix, 45*Math.PI/180.0, canvas.width/canvas.height, 0.1, 100); 
    requestAnimationFrame(runRenderLoop);

    var viewMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "viewMatrix");
    var projectionMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "projectionMatrix");

    var offsetUniformLocation = gl.getUniformLocation(cube.shaderProgram, "offsets");

    // define camera object with initial values
    var camera = {position: vec3.fromValues(0,0,0), direction: vec3.fromValues(0,0,-1), pitch: 0, yaw: -1*Math.PI/2.0};
   
    function runRenderLoop(){
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);

        //check the keys that are being pressed and change positions 
        moveCamera(camera); 
        var target = vec3.create();
        // update camera target (forces you to look in negative z directiony only)
        vec3.add(target, camera.position, camera.direction);

        // update our view matrix on the regular (perameters: output, eye matrix, target, and up)
        mat4.lookAt(viewMatrix, camera.position, target, vec3.fromValues(0,1,0))
        
        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, 0, -9]);  // MIDDLE and push cube away from camera in negative z direction 
        // mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        // mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [-2, 0, -7]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, Math.PI/2);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [-2, 1, -5]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateZ(cube.modelMatrix, cube.modelMatrix, Math.PI/2);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [3, -2, -9]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateZ(cube.modelMatrix, cube.modelMatrix, Math.PI/2);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [3, -3, -6]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, Math.PI/2);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, 3, -5]);  // MIDDLE and push cube away from camera in negative z direction 

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, -3, -5]);  // MIDDLE and push cube away from camera in negative z direction 

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [3, 3, -6]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, Math.PI/2);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [-2, -3, -6]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, Math.PI/2);

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

        // -------------- Three Cubes------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, 3, -8]);  // MIDDLE and push cube away from camera in negative z direction 

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);

        gl.uniform4fv(offsetUniformLocation, offsetsVector);

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 4);  // 3 instances

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

var isLDown = false; 
var isRDown = false; 
var isUDown = false; 
var isDDown = false; 

var isADown = false;
var isSDown = false; 

var isWDown = false; 
var isZDown = false; 

// press keys down 
document.addEventListener("keydown", (event)=> {

    // left arrow key
    if (event.keyCode == 37){
        isLDown = true;         
    }

    // right arrow key
    if (event.keyCode == 39){
        isRDown = true;
    }

    // up arrow key
    if (event.keyCode == 38){
        isUDown = true; 
    }

    // down arrow key
    if (event.keyCode == 40){
        isDDown = true;
    }

    // A key 
    if (event.keyCode == 65){
        isADown = true;
    }

    // S key
    if (event.keyCode == 83){
        isSDown = true;
    }

     // W key
     if (event.keyCode == 87){
        isWDown = true;
    }

     // Z key
     if (event.keyCode == 90){
        isZDown = true;
    }
});

// release keys 
document.addEventListener("keyup", (event)=> {

    // left arrow key
    if (event.keyCode == 37){
        isLDown = false; 
    }

    // right arrow key
    if (event.keyCode == 39){
        isRDown = false;
    }

    // up arrow key
    if (event.keyCode == 38){
        isUDown = false; 
    }

    // down arrow key
    if (event.keyCode == 40){
        isDDown = false;
    }

    // A key 
    if (event.keyCode == 65){
    isADown = false;
    }

    // S key
    if (event.keyCode == 83){
        isSDown = false;
    }

    // W key
    if (event.keyCode == 87){
        isWDown = false;
    }

     // Z key
     if (event.keyCode == 90){
        isZDown = false;
    }
});

function moveCamera(camera) {

    var movementDirection = vec3.create();
    camera.direction[0] = Math.cos(camera.pitch)*Math.cos(camera.yaw);
    camera.direction[1] = Math.sin(camera.pitch);
    camera.direction[2] = Math.cos(camera.pitch)*Math.sin(camera.yaw);

    camera.right = vec3.fromValues(-1*Math.sin(camera.yaw), 0, Math.cos(camera.yaw)); 

    //----------------------------------------SIDE_TO_SIDE----------------------------------------------------
    // negative x direction, move left
    if(isLDown){
         
        vec3.scale(movementDirection, camera.right, -0.1);

        // add old camera position and direction
        vec3.add(camera.position, camera.position, movementDirection);
    }

    // positive x direction, move right
    if(isRDown){

        vec3.scale(movementDirection, camera.right, 0.1);

        // add old camera position and direction
        vec3.add(camera.position, camera.position, movementDirection);
    }

    //-----------------------------------------------YAW-------------------------------------------------------
    // comma, negative x direction, rotate left
    if(isADown){
        camera.yaw -=0.02;
    }

    // period, positive x direction, rotate right
    if(isSDown){
        camera.yaw +=0.02;
    }

    //-----------------------------------------------PITCH-------------------------------------------------------

    // rotate up 
    if(isWDown){
        camera.pitch +=0.02;
    }
    
    // rotate down
    if(isZDown){
        camera.pitch -=0.02;
    }

    //----------------------------------------------ZOOM--------------------------------------------------------
    // negative z direction, zoom in
    if(isUDown){
        
        vec3.scale(movementDirection, camera.direction, 0.1);

        // add old camera position and direction
        vec3.add(camera.position, camera.position, movementDirection);
    }

    // positive z direction, zoom out
    if(isDDown){
         vec3.scale(movementDirection, camera.direction, -0.1);
        
        // add old camera position and direction
        vec3.add(camera.position, camera.position, movementDirection);
    }
}