const fs = require('fs');
const turf = require('turf')

fs.readFile('zones.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const obj = JSON.parse(data);
  const centroid = turf.centroid(obj.features[0]);
  console.log(centroid);
});