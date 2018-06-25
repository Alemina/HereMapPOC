var fs = require('fs');
var request = require('request');
var parseWkt = require('wellknown');

var appId = 'txpoz50GfMuyShPMF5I2';
var appCode = 'nN57_wL6Z_SpALh5sgKoMg';

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



arePointsInGeofence('./route.wkt', 5, 50, points => {
    console.log('POINTS:');
    console.log(points);

    var file = points.join('\n');
    fs.writeFileSync('result.txt', file);
});