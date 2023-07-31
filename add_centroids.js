const fs = require('fs');
const turf = require('turf')

fs.readFile('london_zones.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const obj = JSON.parse(data);
  const centroids = [];
  for (var i = 0; i < obj.features.length; i++) {
    let centroid = turf.centroid(obj.features[i]);
    centroid.id = obj.features[i].id;
    centroid.properties = obj.features[i].properties;
    centroids.push(centroid);
  }
  console.log(centroids);
  fs.writeFile('london_centroids.json', JSON.stringify(centroids), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Data written to file');
  });
});
