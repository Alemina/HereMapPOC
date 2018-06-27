var fs = require('fs');
var http = require('http');
var request = require('request');
var parseWkt = require('wellknown');

var appId = 'txpoz50GfMuyShPMF5I2';
var appCode = 'nN57_wL6Z_SpALh5sgKoMg';


http.createServer(function (request, response) {

  // HTML
  if (request.method === 'GET' && request.url === '/') {

    fs.readFile('./index.html', function(error, content) {
        if (error){
            response.writeHead(404);
            response.write('File not found!');
            response.end();
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
        }
    });

  // CSS
  } else if (request.method === 'GET' && request.url === '/style.css') {

    var cssFile = fs.readFileSync('./style.css');
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(cssFile);
    response.end();

  // SCRIPT
  } else if (request.method === 'GET' && request.url === '/script.js') {

    var scriptFile = fs.readFileSync('./script.js');
    response.writeHead(200, {"Content-Type": "text/javascript"});
    response.write(scriptFile);
    response.end();

  // REST /area
  } else if (request.method === 'GET' && request.url === '/area') {

    arePointsInGeofence('./route1.wkt', 5, 50, points => {
        console.log('POINTS:');
        console.log(points);

        var file = points.join('\n');
        fs.writeFileSync('result1.txt', file);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(points));
    });

  // REST /points
  } else if (request.method === 'GET' && request.url === '/road') {

    arePointsInGeofence('./route2.wkt', 6, 50, points => {
        console.log('POINTS:');
        console.log(points);

        var file = points.join('\n');
        fs.writeFileSync('result2.txt', file);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(points));
    });

  } else {
    response.statusCode = 404;
    response.end();
  }



}).listen(3000);
console.log('Server is running on http://localhost:3000');




// FUNCTIONS

function arePointsInGeofence(pointsWktFile, geofenceId, radius, cb){

    var pointsWktFile = fs.readFileSync(pointsWktFile).toString('utf8');
    var points = parseWkt(pointsWktFile).coordinates;
    var pointsString = prepareCoordinatesString(points, radius);
    var url = 'https://gfe.cit.api.here.com/2/search/proximity.json?app_id=' + appId + '&app_code=' + appCode + '&layer_ids=' + geofenceId + '&proximity=' + pointsString;
 
    console.log(url);
    request(url, function (error, response, body) {
        console.log('statusCode:', response && response.statusCode);
        var results = JSON.parse(body).results;
        results.forEach((result, index) => {
            points[index][2] = !!result.geometries.length;
        });
        cb(points);
    });

}

function prepareCoordinatesString(coordinates, radius){
    var result = coordinates.map(point => {
        var str = point[1] + ',' + point[0];
        str += radius ? (',' + radius) : '';
        return str;
    });
    return result.join(';');
}
