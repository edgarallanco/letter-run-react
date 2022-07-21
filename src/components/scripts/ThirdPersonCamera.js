import { Vector3 } from 'three';

class ThirdPersonCamera {
  constructor(params) {
    this.params = params;
    this.camera = params.camera;

    this.currentPosition = new Vector3();
    this.currentLookAt = new Vector3();
  }

  update = (timeElapsed) => {
    // console.log(timeElapsed);
    const idealOffset = this.calculateIdealOffset();
    const idealLookAt = this.calculateIdealLookAt();

    // const t = 4 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    // console.log(idealOffset);
    this.currentPosition.lerp(idealOffset, t);
    this.currentLookAt.lerp(idealLookAt, t);

    // console.log(this.currentPosition);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  calculateIdealOffset = () => {
    const idealOffset = new Vector3(-15, 20, -30);
    // console.log(idealOffset);
    idealOffset.applyQuaternion(this.params.target.quaternion);
    idealOffset.add(this.params.target.position);

    return idealOffset;
  }

  calculateIdealLookAt = () => {
    const idealLookAt = new Vector3(0, 10, 50);
    idealLookAt.applyQuaternion(this.params.target.quaternion);
    idealLookAt.add(this.params.target.position);

    return idealLookAt;
  }
}

export default ThirdPersonCamera;