import React from "react";
import { useGLTF } from "@react-three/drei";

export function WelcomeAvatar({ core = {} }) {
  let gltf = useGLTF(
    `https://d1a370nemizbjq.cloudfront.net/20077d0b-fd84-4b1c-a1b1-edd3c110423c.glb`
  );

  // let cloned = useRef(false)
  // useEffect(() => {
  //

  gltf.scene.traverse((it) => {
    if (it.material) {
      // if (it.material.name === "Wolf3D_Skin") {
      //   return;
      // }
      // if (it.material.name === "Wolf3D_Eye") {
      //   return;
      // }

      it.castShadow = true;

      if (core && core.envMap) {
        it.material.envMap = core.envMap;
      }
      // it.material.metalness = 1.0;
      // it.material.roughness = 0.0;
      // console.log(it.material);
      // if (it.material) {
      //   it.material.roughnessMapIntensity = 0.05;
      //   it.material.metalnessMapIntensity = 2.0;
      // }
    }
  });

  return <primitive object={gltf.scene}></primitive>;
}
//
