var express = require('express');
var app = express();
var path = require('path');

app.listen(8080);

// we are specifying the html directory as another public directory
app.use(express.static(path.join(__dirname, 'examples')));

app.use('/glmatrix', express.static(__dirname + '/node_modules/gl-matrix/dist/'));

// a convenient variable to refer to the HTML directory
var ex_dir = './examples/';

// routes to serve the static HTML files
app.get('/triangle', function(req, res) {
    res.sendfile(ex_dir + '/triangle/triangle.html');
});

// routes to serve the static HTML files
app.get('/cube', function(req, res) {
    res.sendfile(ex_dir + '/cube/cube.html');
});

