export function getDirectionOffset(w, s, d, a) {
  let directionOffset = Math.PI / 0.55555; // w

  if (w) {
    if (a) {
      directionOffset = Math.PI / 2 - Math.PI / 2; // w+a
    } else if (d) {
      directionOffset = -Math.PI / 2; // w+d
    }
  } else if (s) {
    if (a) {
      directionOffset = Math.PI / 4 + Math.PI / 4; // s+a
    } else if (d) {
      directionOffset = -Math.PI / 2 - Math.PI / 2; // s+d
    } else {
      directionOffset = Math.PI / 0.3555; // s
    }
  } else if (a) {
    directionOffset = Math.PI / 3; // a
  } else if (d) {
    directionOffset = -Math.PI / 1.5; // d
  }

  return directionOffset;
}
