'use strict';
import { lettersCoordinates } from '../resources/LettersCoordinates';

export const pointInsideGeometry = (x, y) => {
  // console.log(x, y);
  const pointInPolygon = require('robust-point-in-polygon');
  let insideLetter = null;
  lettersCoordinates.forEach((obj) => {
    // console.log(obj);
    if (pointInPolygon(obj.coordinates, [x, y]) <= 0) {
      insideLetter = obj;
      return;
    }
  });

  return insideLetter;
};

export const checkIfInsideCircle = (position, center) => {
  let radius = 2;

  // let newRadius = distanceInKmBetweenEarthCoordinates(position.x, position.z, center.x, center.z);
  // console.log(newRadius)

  // // if( newRadius < radius ) {
  // //     //point is inside the circle
  // //     console.log('inside')
  // // }
  // // else if(newRadius > radius) {
  // //     //point is outside the circle
  // //     console.log('outside')
  // // }

  // return newRadius < radius;

  let a = center.x, b = center.z, x = position.x, y = position.z;

  var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
  radius *= radius;
  console.log(dist_points, radius);
  if (dist_points < radius) {
    return true;
  }
  return false;

}

const distanceInKmBetweenEarthCoordinates = (lat1, lon1, lat2, lon2) => {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

const degreesToRadians = (degrees) => {
  return degrees * Math.PI / 180;
}