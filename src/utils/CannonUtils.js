import { BufferGeometry } from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as CANNON from 'cannon-es';

class CannonUtils {
  constructor() { }

  static CreateTrimesh(geometry) {
    if (!(geometry).attributes) {
      geometry = new BufferGeometry().fromGeometry(
        geometry
      );
    }
    const vertices = (
      (geometry).attributes.position.array
    );
    const indices = Object.keys(vertices).map(Number);
    return new CANNON.Trimesh(vertices, indices);
  }

  static createFromIndexed(mesh) {
    let geometry = new BufferGeometry();
    // geometry.setAttribute('position', mesh.geometry.getAttribute('position'));

    geometry = BufferGeometryUtils.mergeVertices(mesh.geometry);
    //if using import statement  
    //geometry = BufferGeometryUtils.mergeVertices(geometry);  

    const position = geometry.attributes.position.array;
    const index = geometry.index.array;

    const points = [];
    for (let i = 0; i < position.length; i += 3) {
      points.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]));
    }
    const faces = [];
    for (let i = 0; i < index.length; i += 3) {
      faces.push([index[i], index[i + 1], index[i + 2]]);
    }

    return new CANNON.ConvexPolyhedron({ vertices: points, faces });
  }
}

export default CannonUtils;
