var fs = require('fs');
var request = require('request');

var appId = 'txpoz50GfMuyShPMF5I2';
var appCode = 'nN57_wL6Z_SpALh5sgKoMg';


function uploadNewGeofence(filePath, geofenceId) {
    var url = 'https://gfe.cit.api.here.com/2/layers/upload.json?layer_id=' + geofenceId + '&app_id=' + appId + '&app_code=' + appCode;

    var req = request.post(url, function (err, resp, body) {
      if (err) {
        console.log('Error!');
        console.log(err);
      } else {
        console.log('Response: ');
        console.log(body);
      }
    });
    var form = req.form();
    form.append('file', fs.createReadStream(filePath));
}

uploadNewGeofence('./area.wkt', 5);

uploadNewGeofence('./line.wkt', 6);