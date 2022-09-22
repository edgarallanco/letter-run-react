
import { DoubleSide, Euler } from "three";
import { Vector3, PlaneGeometry, Mesh, MeshBasicMaterial} from "three";
import * as CANNON from 'cannon-es';
import { BoxGeometry } from "three";

const planes = [
  {
    width: 21,
    height: 10,
    position: new Vector3(31.083106006630963, 2.774262009854787, 21.67757484053361),
    rotation: new Euler(0, Math.PI / 2, 0)
  },
  {
    width: 21,
    height: 10,
    position: new Vector3(45.70969219965357, 2.774262009854787, 21.67757484053361),
    rotation: new Euler(0, Math.PI / 2, 0)
  },
  {
    width: 5,
    height: 10,
    position: new Vector3(33.77840983009789, 2.774262009854787, 31.002581668973665),
    rotation: new Euler(0, 0, 0)
  },
  {
    width: 5,
    height: 10,
    position: new Vector3(33.77840983009789, 2.774262009854787, 11.121703756194407),
    rotation: new Euler(0, 0, 0)
  },
  {
    width: 5,
    height: 10,
    position: new Vector3(43.00401850470569, 2.774262009854787, 31.002581668973665),
    rotation: new Euler(0, 0, 0)
  },
  {
    width: 5,
    height: 10,
    position: new Vector3(42.876029369005444, 2.774262009854787, 12.121703756194407),
    rotation: new Euler(0, 0, 0)
  },
  {
    width: 10.5,
    height: 10,
    position: new Vector3(36.47056805662442, 2.774262009854787, 26.280025937231436),
    rotation: new Euler(0, Math.PI / 2, 0)
  },
  {
    width: 10.5,
    height: 10,
    position: new Vector3(40.3027439915502, 2.774262009854787, 16.20403915829007),
    rotation: new Euler(0, Math.PI / 2, 0)
  },
  {
    width: 11.5,
    height: 10,
    position: new Vector3(38.678995136740524, 2.774262009854787, 16.804942252292891),
    rotation: new Euler(0, - Math.PI / 2.68, 0)
  },
  {
    width: 11.5,
    height: 10,
    position: new Vector3(38.08640489255621, 2.774262009854787, 25.77485664925358),
    rotation: new Euler(0, - Math.PI / 2.68, 0)
  },
]

export const loadPlanes = (scene, world) => {
  planes.forEach((plane) => {
    let planeBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(plane.width, plane.height, 0.5)),
      type: CANNON.Body.STATIC
    });
    planeBody.position.copy(plane.position);
    planeBody.quaternion.setFromEuler(plane.rotation.x, plane.rotation.y, plane.rotation.z);
    world.addBody(planeBody);

    let geometry = new BoxGeometry(plane.width, plane.height, 0.5);
    let mesh = new Mesh(geometry, new MeshBasicMaterial({color: 0x00ff00, side: DoubleSide}));
    mesh.position.copy(plane.position);
    mesh.quaternion.copy(planeBody.quaternion);
    // mesh.quaternion.setFromEuler(plane.rotation);
    // scene.add(mesh);
  })
}