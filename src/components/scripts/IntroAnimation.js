import gsap from 'gsap';
import { Vector3 } from 'three';

export const animate = (camera, cameraMesh, setCamPosition, initialPos) => {
  return new Promise((resolve, reject) => {
    let animDuration = 2.5;
    // console.log(cameraMesh.position);
    // let initialPosition = new Vector3();
    let camInitialPos = new Vector3(initialPos[0], initialPos[1], initialPos[2]);
    camera.position.copy(camInitialPos);
    // console.log(camera.position);
    gsap.to(camInitialPos, {
      ease: "none", duration: (animDuration - .5), delay: .5, x: 5.78651222602025, y: 72.32470228479104, z: 60.826936793399625,
      onUpdate: () => {
        setCamPosition(camInitialPos);
      },
      onComplete: () => {
        resolve()
      }
    });

    gsap.to(cameraMesh.position, { ease: "none", duration: (animDuration - 1), delay: 1, x: -57.53, z: -8 })
    gsap.to(camera, { ease: "none", duration: animDuration, zoom: 4.5 })
  });

}