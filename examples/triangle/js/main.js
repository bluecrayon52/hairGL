
document.addEventListener("DOMContentLoaded", start);
var gl;

function start()
{
    console.log("hello from hairGL!");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    // on the CPU
    var triangleVertices = [
        1.0, -1.0, 0.0,
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0
    ]
    
    // on the GPU
    var triangleVertexPositionBuffer = gl.createBuffer(); 

    // Gate between CPU and GPU 
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    // on the CPU
    var triangleColors = [
        1.0, 0.0, 0.0, 1.0, 
        0.0, 1.0, 0.0, 1.0, 
        0.0, 0.0, 1.0, 1.0
    ]

    // on the GPU
    var triangleVertexColorBuffer = gl.createBuffer(); 

    // Gate between the CPU and GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);

    // x, y, z, 
    var triangleVerticesAndColors = [
        1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 
        -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0
    ]

    var triangleVertexPositionAndColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionAndColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticesAndColors), gl.STATIC_DRAW);

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
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    // // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    // gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    // // void  gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    // gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    const FLOAT_SIZE = 4; 
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionAndColorBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 7*FLOAT_SIZE, 0);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 7*FLOAT_SIZE, 3*FLOAT_SIZE);

    requestAnimationFrame(runRenderLoop);
    
    function runRenderLoop()
    {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // var vao = gl.createVertexArray();
        // gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

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