import gsap from 'gsap';
import { Vector3, Euler } from 'three';

export const animate = (camera, cameraMesh, setCamPosition, setCamRotation, initialPos) => {
  return new Promise((resolve, reject) => {
    let animDuration = 6;
    let firstTurnDuration = 3;
    // console.log(cameraMesh.position);
    // let initialPosition = new Vector3();
    let camInitialPos = new Vector3(initialPos[0], initialPos[1], initialPos[2]);
    camera.position.copy(camInitialPos);
    // console.log(camera.position);
    gsap.to(camInitialPos, {
      ease: "power3.inOut", duration: (animDuration), x: 5.78651222602025, y: 72.32470228479104, z: 60.826936793399625,
      onComplete: () => {
        resolve()
      }
    });
    
    let cameraClone = camera.clone();
    cameraClone.position.set(5.78651222602025, 72.32470228479104, 60.826936793399625);
    cameraClone.lookAt(new Vector3(-57.53, 3.79, -8)); // get the final rotation angle

    let initRotation = new Euler().copy(camera.rotation);
    let firstTurn = new Euler(-1.1836661949837597, 0.2777552631574957, 0.29842282712464797, "XYZ");
    // let finalTUrn = new Euler(-0.7844577074118149, 0.5778787186338901, 0.49916736753750035, "XYZ");
    let finalTUrn = new Euler().copy(cameraClone.rotation);

    let camRotation = gsap.timeline();
    /* camRotation.to(initRotation, {ease: "easeIn", duration: firstTurnDuration, x: firstTurn.x, y: firstTurn.y, z: firstTurn.z,
    onUpdate: () => {
      setCamRotation(initRotation);
    }
    }); */
    camRotation.to(initRotation, {ease: "power3.inOut", duration: (animDuration), x: finalTUrn.x, y: finalTUrn.y, z: finalTUrn.z,
      onUpdate: () => {
        setCamRotation(initRotation);
      }
    })

    gsap.to(cameraMesh.position, { ease: "power3.inOut", duration: (animDuration), x: -57.53, z: -8, 
      onUpdate: () => {
        // console.log(camera.rotation);
        setCamPosition(camInitialPos);
      },
      onStart: () => {
        // console.log(camera.rotation);
      } })
    gsap.to(camera, { ease: "power3.inOut", duration: animDuration, zoom: 4.5 })
    window.addEventListener('finalZoom', function() {
      gsap.to(camera, { ease: "power3.inOut", duration: (animDuration / 2), zoom: 8 })
      
    })
  });

  
}