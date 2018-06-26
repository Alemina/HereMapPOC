var polygon = '';

(function() {
  console.log("js works");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/points", true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        polygon = xhr.responseText;
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);

})()



function polygonTest(map){


  let wkt_polygon = "POLYGON((15.453757994384773 51.96300052623031, 15.462684385986336 51.93506785397462, 15.504226439208992 51.91389515484617, 15.571861021728523 51.92956391294866, 15.570831053466804 51.96215433722311, 15.490836851806648 51.96617359273894, 15.453757994384773 51.96300052623031))";
  let geoPolygon = H.util.wkt.toGeometry(wkt_polygon);
  let polyarea = new H.map.Polygon(geoPolygon);
  map.addObject(polyarea);
  
  
  let wkt_linestring = "LINESTRING(15.571892968354632 51.98959454818152, 15.568974724946429 51.98473163054565, 15.567773095307757 51.98155987803876, 15.565026513276507 51.9671784496061,  15.562619986807704 51.964321379458966, 15.56021672753036 51.96114818182262,    15.55798512962997 51.95829211188356,   15.555066886221766 51.954801112626086, 15.551805320059657 51.94617823765917,  15.54778169596193 51.941972801577684, 15.548125018715837 51.93816303916152, 15.549498309731462 51.93451171324214, 15.552588214516618 51.931124710523136, 15.556364764809587 51.9281608734266,    15.56228708231447 51.92440286998331,    15.56675027811525 51.92154445951583,  15.571728458046891 51.91826235636438, 15.574818362832048 51.91614474311797)";
  let geoLine = H.util.wkt.toGeometry(wkt_linestring);
  let polyline = new H.map.Polyline(geoLine);
  map.addObject(polyline, { style: {
    strokeColor: 'black'
  } });

  map.setCenter({lat:51.96300052623031, lng:15.453757994384773});
  map.setZoom(14);








}

(function initializeMap(){
  console.log("inside")
  //Step 1: initialize communication with the platform
  var platform = new H.service.Platform({
    app_id: 'DemoAppId01082013GAL',
    app_code: 'AJKnXv84fjrb0KIHawS0Tg',
    useCIT: true,
    useHTTPS: true
  });
  var pixelRatio = window.devicePixelRatio || 1;
  var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
  });

  //Step 2: initialize a map  - not specificing a location will give a whole world view.
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map, {pixelRatio: pixelRatio});

  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  // Now use the map as required...
  setTimeout(function() {polygonTest(map) }, 2000);

})();