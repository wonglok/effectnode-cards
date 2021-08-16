import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, useFBX, useGLTF } from "@react-three/drei";
import { AnimationMixer, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

export function WelcomeAvatar({ envMap }) {
  let gltf = useGLTF(
    `https://d1a370nemizbjq.cloudfront.net/20077d0b-fd84-4b1c-a1b1-edd3c110423c.glb`
  );

  let avatar = useMemo(() => {
    let scene = SkeletonUtils.clone(gltf.scene);
    return scene;
  }, [gltf]);

  let mixer = useMemo(() => {
    let mixer = new AnimationMixer();
    return mixer;
  }, [avatar]);

  let fbx = {
    idle: useFBX(`/rpm-actions/mma-idle.fbx`),
    // kick: useFBX(`/rpm-actions/mma-kick.fbx`),
    warmup: useFBX(`/rpm-actions/mma-warmup.fbx`),
    sillyjoey: useFBX(`/rpm-actions/silly-dance.fbx`),
    hiphop: useFBX(`/rpm-actions/dance-hiphop.fbx`),
    bow: useFBX(`/rpm-actions/bow-quick-formal.fbx`),
    hi0: useFBX(`/rpm-actions/hi-wave-both-hands.fbx`),
  };

  let actions = useMemo(() => {
    let actions = {};
    for (let kn in fbx) {
      actions[kn] = mixer.clipAction(fbx[kn].animations[0], avatar);
    }
    return actions;
  }, Object.values(fbx));

  useEffect(() => {
    avatar.traverse((it) => {
      it.frustumCulled = false;

      if (it.material) {
        if (
          it.material.name === "Wolf3D_Skin" ||
          it.material.name === "Wolf3D_Eye"
        ) {
        } else {
          if (envMap) {
            it.material.envMap = envMap;

            it.material.metalness = 1.0;
            it.material.roughness = 0.05;
            it.material.roughnessMapIntensity = 0.02;
            it.material.metalnessMapIntensity = 1.0;
          }
        }
      }
    });

    return () => {};
  }, [avatar]);

  useFrame((st, dt) => {
    mixer.update(1 / 60);
  });

  return (
    <group>
      <ShakeCam avatar={avatar}></ShakeCam>
      <Sequencer avatar={avatar} mixer={mixer} actions={actions}></Sequencer>
    </group>
  );
}

export function ShakeCam({ avatar }) {
  let current = new Vector3();
  let last = new Vector3();
  let diff = new Vector3();
  let applyDiff = new Vector3();
  useFrame((st, dt) => {
    let applyShake = last.length() !== 0.0;
    last.copy(current);
    avatar.getObjectByName("Head").getWorldDirection(current);

    if (applyShake) {
      diff.copy(current).sub(last);
      applyDiff.lerp(diff, 0.02);
      st.camera.rotation.x += 1.0 * applyDiff.x;
      st.camera.rotation.y += 1.0 * applyDiff.y;
    }
  });

  return null;
}

function Sequencer({ avatar, mixer, actions }) {
  let ref = useRef();
  let banner = useRef();
  let [text, setText] = useState("Welcome to Your Card!");

  useEffect(() => {
    let skip = false;
    let cursor = 0;

    let last = false;
    let sequences = [
      //
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.hi0.reset();
        actions.hi0.repetitions = 1;
        actions.hi0.clampWhenFinished = true;
        actions.hi0.play();
        last = actions.hi0;
        setText("Welcome to our FANCY spaceship!");
      },
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.sillyjoey.reset();
        actions.sillyjoey.repetitions = 1;
        actions.sillyjoey.clampWhenFinished = true;
        actions.sillyjoey.play();
        actions.sillyjoey.fadeIn(0.1);
        last = actions.sillyjoey;
        setText("This is a Place for You to be You.");
      },
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.warmup.reset();
        actions.warmup.repetitions = 1;
        actions.warmup.clampWhenFinished = true;
        actions.warmup.play();
        actions.warmup.fadeIn(0.1);
        last = actions.warmup;
        setText("You can add stuff here");
      },
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.bow.reset();
        actions.bow.repetitions = 1;
        actions.bow.clampWhenFinished = true;
        actions.bow.play();
        actions.bow.fadeIn(0.1);
        last = actions.bow;
        setText("Thanks for visiting us!");
      },
    ];

    sequences[0]();

    let h = {
      loop: () => {
        //
        console.log("loop ends");
      },
      finished: () => {
        //
        console.log("finished");
        cursor++;
        cursor = cursor % sequences.length;

        if (!skip) {
          sequences[cursor]();
        }
      },
    };
    mixer.addEventListener("loop", h.loop);
    mixer.addEventListener("finished", h.finished);

    return () => {
      skip = true;
      mixer.removeEventListener("loop", h.loop);
      mixer.removeEventListener("finished", h.finished);
    };
  }, []);

  useEffect(() => {
    let refer = ref.current;
    //
    refer.add(avatar);
    return () => {
      refer.remove(avatar);
    };
  }, [avatar]);

  return (
    <group>
      <Text
        position={[0, 2, 0.5]}
        ref={banner}
        textAlign={"center"}
        anchorX={"center"}
        anchorY={"bottom"}
        maxWidth={3.5}
        fontSize={0.15}
        font={`/font/Cronos-Pro-Light_12448.ttf`}
        frustumCulled={false}
        color={"black"}
        letterSpacing={0.05}
        userData={{ enableBloom: true }}
        outlineColor="white"
        outlineWidth={0.01}
      >
        {text}
      </Text>

      <group ref={ref}></group>
    </group>
  );
}
