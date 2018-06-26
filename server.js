var fs = require('fs');
var http = require('http');
var request = require('request');
var parseWkt = require('wellknown');

var appId = 'txpoz50GfMuyShPMF5I2';
var appCode = 'nN57_wL6Z_SpALh5sgKoMg';


http.createServer(function (request, response) {


  // response.writeHead(200, {'Content-Type': 'text/html'});
  // fs.readFile('./index.html', null, function(error, data){
  //   if (error){
  //     response.writeHead(404);
  //     response.write('File not found!');
  //   }else{
  //     response.write(data);
  //   }
  //   response.end();
  // });

  if (request.method === 'GET' && request.url === '/points') {

    arePointsInGeofence('./route.wkt', 5, 50, points => {
        console.log('POINTS:');
        console.log(points);

        var file = points.join('\n');
        fs.writeFileSync('result.txt', file);

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


