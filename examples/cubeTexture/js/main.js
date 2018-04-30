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

    // on the GPU
    cube.colorBuffer = gl.createBuffer(); 
    // Gate between the CPU and GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.colors), gl.STATIC_DRAW);

    // on GPU 
    cube.textureCoordinatesBuffer = gl.createBuffer(); 
    // Gate between the CPU and GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.textureCoordinatesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.textureCoordinates), gl.STATIC_DRAW); 

    //----------------------------------------TEXTURE 1-------------------------------------------------//
    cube.texture1 = gl.createTexture(); 
    cube.texture1.image = new Image(); 
    cube.texture1.image.src = "/images/desert_stone_512.jpg";

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

    //----------------------------------------TEXTURE 2-------------------------------------------------//
    cube.texture2 = gl.createTexture(); 
    cube.texture2.image = new Image(); 
    cube.texture2.image.src = "/images/cream_wave_1024.jpg";

    // overwrite onload function
    cube.texture2.image.onload = () => {

        // yet another Gate hath opened 
        gl.bindTexture( gl.TEXTURE_2D, cube.texture2);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cube.texture2.image); 

         // another option used to select pixel matching when there is not a 1 to 1 ratio
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);  
    } 

    //----------------------------------------TEXTURE 3-------------------------------------------------//
    cube.texture3 = gl.createTexture(); 
    cube.texture3.image = new Image(); 
    cube.texture3.image.src = "/images/stone_cube_256.png";

    // overwrite onload function
    cube.texture3.image.onload = () => {

        // yet another Gate hath opened 
        gl.bindTexture( gl.TEXTURE_2D, cube.texture3);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cube.texture3.image); 

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

    cube.colorAttributeLocation = gl.getAttribLocation(cube.shaderProgram, "color");
    gl.enableVertexAttribArray(cube.colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
    // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(cube.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

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
    // gl.uniform1i(cube.samplerUniformLocation, 0); 

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cube.texture2);
    // gl.uniform1i(cube.samplerUniformLocation, 0); 

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, cube.texture3);
    
    return cube; 
}

function start(){

    console.log("hello from the Four Cubes");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    var cube = createCube();

    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();

    // make a camera 
    mat4.perspective(projectionMatrix, 45*Math.PI/180.0, canvas.width/canvas.height, 0.1, 30); 
    requestAnimationFrame(runRenderLoop);

    var viewMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "viewMatrix");
    var projectionMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "projectionMatrix");

    // var angle = .1; // define the increment of rotation 
    var angle = 0;  // another way of incrementing the angle
    
    function runRenderLoop(){
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);

        // --------------First Cube------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [-2, 0, -5]);  // LEFT and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        // mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
        angle += 0.01;    // another way of incrementing the angle

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);
        gl.uniform1i(cube.samplerUniformLocation, 0); // change the texture used

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points
        
        // --------------Second Cube------------------------------------------------------------------------------------ 
        mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, 0, -5]);  // MIDDLE and push cube away from camera in negative z direction 
        mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        // mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
        angle += 0.01;    // another way of incrementing the angle

        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);
        gl.uniform1i(cube.samplerUniformLocation, 2); // change the texture used

        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points

         // --------------Third Cube------------------------------------------------------------------------------------ 
         mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

         mat4.translate(cube.modelMatrix, cube.modelMatrix, [2, 0, -5]);  // RIGHT and push cube away from camera in negative z direction 
         mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        //  mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
         angle += 0.01;    // another way of incrementing the angle
 
         gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
         gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
         gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);
         gl.uniform1i(cube.samplerUniformLocation, 1); // change the texture used

         gl.useProgram(cube.shaderProgram);
         gl.bindVertexArray(cube.vao);
         gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points

         // --------------Fourth Cube------------------------------------------------------------------------------------ 
        //  mat4.identity(cube.modelMatrix);   // another way of incrementing the angle

        //  mat4.translate(cube.modelMatrix, cube.modelMatrix, [4.5, 0, -22]);  // RIGHT and push cube away from camera in negative z direction 
        //  mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        //  mat4.rotateX(cube.modelMatrix, cube.modelMatrix, angle/8);
        //  angle += 0.01;    // another way of incrementing the angle
 
        //  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        //  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        //  gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);
 
        //  gl.useProgram(cube.shaderProgram);
        //  gl.bindVertexArray(cube.vao);
        //  gl.drawArrays(gl.TRIANGLES, 0, 36); // rendering 36 points
 

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