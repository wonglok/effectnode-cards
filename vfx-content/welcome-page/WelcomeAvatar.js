import React, { useEffect, useRef, useState } from "react";
import { useFBX, useGLTF } from "@react-three/drei";
import { AnimationMixer } from "three";
import { useFrame } from "@react-three/fiber";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

export function WelcomeAvatar({ core = {} }) {
  let gltf = useGLTF(
    `https://d1a370nemizbjq.cloudfront.net/20077d0b-fd84-4b1c-a1b1-edd3c110423c.glb`
  );

  let fbx = {
    idle: useFBX(`/rpm-actions/mma-idle.fbx`),
    kick: useFBX(`/rpm-actions/mma-kick.fbx`),
    kick2: useFBX(`/rpm-actions/mma-kick-2.fbx`),
  };
  let actions = {};

  let ref = useRef();

  let [cloned] = useState(() => {
    let scene = SkeletonUtils.clone(gltf.scene);

    return scene;
  });

  let [mixer] = useState(() => {
    let mixer = new AnimationMixer();

    for (let kn in fbx) {
      actions[kn] = mixer.clipAction(fbx[kn].animations[0], cloned);
    }
    return mixer;
  });

  useEffect(() => {
    let refer = ref.current;

    actions.idle?.play();

    cloned.traverse((it) => {
      it.frustumCulled = false;
      if (it.material) {
        it.material = it.material.clone();
        if (it.material.name === "Wolf3D_Skin") {
          return;
        }
        if (it.material.name === "Wolf3D_Eye") {
          return;
        }
        it.castShadow = true;
        if (core && core.envMap) {
          it.material.envMap = core.envMap;
        }
        it.material.metalness = 1.0;
        it.material.roughness = 0.0;
        // console.log(it.material);
        if (it.material) {
          it.material.roughnessMapIntensity = 0.1;
          it.material.metalnessMapIntensity = 1.0;
        }
      }
    });

    refer.add(cloned);

    return () => {
      // if (refer && cloned) {
      //   refer.remove(cloned);
      // }
    };
  }, []);

  useFrame((st, dt) => {
    mixer.update(dt);
  });

  return (
    <group>
      <group userData={{ disableBloom: true }} ref={ref}></group>
    </group>
  );
}
