import gsap from 'gsap';
import { Vector3, Euler } from 'three';

export const animate = (camera, cameraMesh, setCamPosition, setCamRotation, setStartRotate, initialPos) => {
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
        // let cameraClone = camera.clone();
        // cameraClone.lookAt(cameraMesh.position);
        // let rotation = new Euler(cameraClone.rotation.x, cameraClone.rotation.y, cameraClone.rotation.z, "XYZ");
        // setCamRotation(rotation);
      },
      onComplete: () => {
        resolve()
      }
    });

    gsap.to(cameraMesh.position, { ease: "none", duration: (animDuration - 1), delay: 1, x: -57.53, z: -8, 
      onUpdate: () => {
        // setStartRotate(true);
        // let cameraClone = camera.clone();
        // cameraClone.lookAt(cameraMesh.position);
        // let rotation = new Euler(cameraClone.rotation.x, cameraClone.rotation.y, cameraClone.rotation.z, "XYZ");
        // setCamRotation(rotation);
      } })
    gsap.to(camera, { ease: "none", duration: animDuration, zoom: 4.5 })

    // let cameraClone = camera.clone();
    // let initial = new Euler(cameraClone.rotation.x, cameraClone.rotation.y, cameraClone.rotation.z, "XYZ");
    // cameraClone.lookAt(cameraMesh.position);
    // let startRotation = new Euler(cameraClone.rotation.x, cameraClone.rotation.y, cameraClone.rotation.z, "XYZ");
    // cameraClone.lookAt(new Vector3(-57.53, 3.79, -8));
    // let endRotation = new Euler(cameraClone.rotation.x, cameraClone.rotation.y, cameraClone.rotation.z, "XYZ");
    // cameraClone.lookAt(startRotation);
    // // console.log(startRotation);
    // // console.log(endRotation);
    // var rotateAnim = gsap.timeline();
    // rotateAnim.to(initial, {ease: "none", duration: .5, x: startRotation.x, y: startRotation.y, z: startRotation.z, 
    // onUpdate: () => {
    //   camera.lookAt(cameraMesh.position);
    //   setCamRotation(initial);
    // }})
    // rotateAnim.to(startRotation, {ease: "none", duration: .5, x: endRotation.x, y: endRotation.y, z: endRotation.z, 
    // onUpdate: () => {
    //   camera.lookAt(cameraMesh.position);
    //   setCamRotation(startRotation);
    // },
    // onComplete: () => {
    //   setIntroDone(true);
    // }})
  });

}