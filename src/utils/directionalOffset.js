export function getDirectionOffset(w, s, d, a) {
  let directionOffset = 0; // w

  if (w) {
    if (a) {
      directionOffset = Math.PI / 4; // w+a
    } else if (d) {
      directionOffset = -Math.PI / 4; // w+d
    }
  } else if (s) {
    if (a) {
      directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
    } else if (d) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
    } else {
      directionOffset = Math.PI; // s
    }
  } else if (a) {
    directionOffset = Math.PI / 2; // a
  } else if (d) {
    directionOffset = -Math.PI / 2; // d
  }

  return directionOffset;
}
