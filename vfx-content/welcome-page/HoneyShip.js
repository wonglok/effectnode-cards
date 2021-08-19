import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";

export function HoneyShip() {
  let { get } = useThree();
  let gltf = useGLTF(`/objects/spaceship-05/spaceship-05.glb`);
  let ref = useRef();

  let clicked = false;
  gltf.scene.traverse((it) => {
    if (it.geometry) {
      it.material.roughness = 0.7;
      it.material.metalness = 0.5;

      it.userData.onClick = () => {
        if (clicked) {
          return;
        }
        clicked = true;

        let counter = 1;
        let v3 = new Vector3(0, 0, 0);
        get().camera.userData.lookAt = v3;

        let tt = setInterval(() => {
          if (ref.current) {
            ref.current.position.z = (1.0 - counter) * 500;
            ref.current.scale.setScalar(counter);
          }

          gltf.scene.getWorldPosition(v3);

          counter *= 0.998;
          if (counter <= 0.1) {
            clicked = false;
            get().camera.userData.lookAt = false;
            get().camera.userData.needsResetLookAt = true;
            ref.current.position.z = 0;
            ref.current.scale.setScalar(1);
            clearInterval(tt);
          }
        }, 1 / 60);
      };
      it.userData.hint = "Zoom Zoom!";
    }
  });

  useFrame(({ clock }) => {
    let t = clock.getElapsedTime();
    gltf.scene.position.y = Math.sin(t) * 0.4;
    gltf.scene.rotation.x = Math.cos(t) * 0.05;
  });

  return (
    <group ref={ref}>
      <group
        scale={2.5}
        rotation={[0.13, Math.PI * 0.0, 0]}
        position={[0.71, 5, -40.18]}
      >
        <primitive object={gltf.scene}></primitive>
      </group>
    </group>
  );
}
