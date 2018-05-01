# hairGL
The goal of this project is to eventually model hair follicles using [webGL](https://get.webgl.org).

This project was built using [Node.js](https://nodejs.org/en/),  [Expess.js](https://expressjs.com), and the node module [gl-matrix](https://www.npmjs.com/package/gl-matrix).

To start the server use the following command from the root folder:
```
node server.js 

```

If you instal [nodemon](https://nodemon.io/) you can also use the following command to automatically restart the server everytime you save a change to the code: 
```
nodemon server.js
```
There are two main folders inside the hairGL directory, *examples* and  *project*.  

The *examples* folder contains various object models that were developed in the process of learning webGL while following a tutorial on [Udemy](https://www.udemy.com) by Ahmed Fathy Hagar, [The Extensive WebGL Series Part 1](https://www.udemy.com/the-extensive-webgl-series-part1-low-level-basics/). 

You can find the following examples in the *examples* folder: 
- triangle: a basic colored triangle using vertex shaders
- rectangle: optimized vertices storage and referance using element array buffer and index buffer 
- cube: an initial foray into the third dimension 
- fourCubes: an OOP refactor using a cube object
- cubeInstances: using *gl_InstanceID*, *gl_VertexID* & *gl.drawArraysInstanced* 
- cubeTexture: using texture coordinates and samplers to add textures to cubes
- cubeCamera: using a camera object to update the view matrix using the gl-matrix lookAt function

The *project* folder *will eventually* contain the code that emplements the modeling of hair follicles, as soon as I figure out how to do that.  