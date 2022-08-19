import { Vector3 } from 'three';

class LinearMovement {

  t = 0;
  dt = 0.001;

  constructor(start, end, step) {
    this.start = start;
    this.end = end;
    if(step)
      this.dt = step;
  }

  ease = (t) => {
    return t < 0.5 ? (2 * t * t) : (-1 + (4 - 2 * t) * t);
  }

  lerp = (a, b, ease) => {
    return a + (b - a) * ease;
  }

  move = () => {
    var newX = this.lerp(this.start.x, this.end.x, this.ease(this.t));
    var newZ = this.lerp(this.start.z, this.end.z, this.ease(this.t));
    var newY = this.lerp(this.start.y, this.end.y, this.ease(this.t));

    var position = new Vector3(newX, newY, newZ);

    this.t += this.dt;

    return position;
  }

}

export default LinearMovement;