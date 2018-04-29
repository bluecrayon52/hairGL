var express = require('express');
var app = express();
var path = require('path');

app.listen(8080);

// we are specifying the html directory as another public directory
app.use(express.static(path.join(__dirname, 'examples')));

app.use('/glmatrix', express.static(__dirname + '/node_modules/gl-matrix/dist/'));

// a convenient variable to refer to the HTML directory
var ex_dir = './examples/';

// routes to serve the static HTML file for triangle
app.get('/triangle', function(req, res) {
    res.sendFile('/triangle/triangle.html', {root: ex_dir});
});

// routes to serve the static HTML file for cube 
app.get('/cube', function(req, res) {
    res.sendFile('/cube/cube.html', {root: ex_dir});
});

// routes to serve the static HTML file for four cubes 
app.get('/fourCubes', function(req, res) {
    res.sendFile('/fourCubes/fourCubes.html', {root: ex_dir});
});

// routes to serve the static HTML file for cube instances
app.get('/cubeInstances', function(req, res) {
    res.sendFile('/cubeInstances/cubeInstances.html', {root: ex_dir});
});

// routes to serve the static HTML file for optimized rectangle
app.get('/rectangle', function(req, res) {
    res.sendFile('/rectangle/rectangle.html', {root: ex_dir});
});