"use strict";
import { lettersCoordinates } from "../resources/LettersCoordinates";

export const pointInsideGeometry = (x, y) => {
  // console.log(x, y);
  const pointInPolygon = require("robust-point-in-polygon");
  let insideLetter = null;
  lettersCoordinates.forEach((obj) => {
    // console.log(obj);
    if(pointInPolygon(obj.coordinates, [x, y]) <= 0) {
      insideLetter = obj.letter;
      return;
    }
  });

  return insideLetter;
}