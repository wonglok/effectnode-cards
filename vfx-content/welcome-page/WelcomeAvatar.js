import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, useFBX, useGLTF } from "@react-three/drei";
import {
  AnimationMixer,
  BackSide,
  Frustum,
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
} from "three";
import { createPortal, useFrame } from "@react-three/fiber";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { useComputeEnvMap } from "../../vfx-metaverse";
import { HelloSign } from "./HelloSign";
import { Portal } from "./Portal";

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
    greetings: useFBX(`/rpm-actions/greetings.fbx`),
    handForward: useFBX(`/rpm-actions/hand-forward.fbx`),
    idle: useFBX(`/rpm-actions/mma-idle.fbx`),
    gesturePointer: useFBX(`/rpm-actions/guesture-pointer.fbx`),
    gesturePointer2: useFBX(`/rpm-actions/guesture-pointer-2.fbx`),
    excited: useFBX(`/rpm-actions/excited.fbx`),
    spin: useFBX(`/rpm-actions/spin-in-place.fbx`),
    happyIdle: useFBX(`/rpm-actions/happy-idle.fbx`),
    happyHand: useFBX(`/rpm-actions/happy-hand.fbx`),
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
  }, [avatar]);

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

    return () => {
      //
    };
  }, [avatar]);

  useFrame((st, dt) => {
    if (dt <= 1 / 60) {
      dt = 1 / 60;
    }
    mixer.update(dt);
  });

  return (
    <group>
      <Sequencer avatar={avatar} mixer={mixer} actions={actions}></Sequencer>
      <ShakeCam avatar={avatar}></ShakeCam>
    </group>
  );
}

export function ShakeCam({ avatar }) {
  let currentPos = new Vector3();
  let current = new Vector3();
  let last = new Vector3();
  let diff = new Vector3();
  let diffApply = new Vector3();
  let cam = new PerspectiveCamera();
  let frustum = new Frustum();
  let ortho = new OrthographicCamera(100, 100);
  useFrame((st, dt) => {
    let tracker = avatar.getObjectByName("Head");

    if (tracker) {
      tracker.getWorldPosition(currentPos);

      cam.copy(st.camera);
      cam.lookAt(currentPos);

      st.camera.updateMatrix();
      st.camera.updateProjectionMatrix();

      ortho.copy(st.camera);
      ortho.updateProjectionMatrix();

      frustum.setFromProjectionMatrix(ortho.projectionMatrix);
      let has = frustum.containsPoint(currentPos);

      //
      last.copy(current);
      cam.getWorldDirection(current);

      diff.copy(current).sub(last);
      diffApply.lerp(diff, 0.2);

      st.camera.rotation.x += diffApply.x;
      st.camera.rotation.y += diffApply.y;
    }
  });

  return null;
}

function Sequencer({ avatar, mixer, actions }) {
  let ref = useRef();
  let banner = useRef();
  let [text, setBannerText] = useState("Welcome to Your Card!");
  let [show, setShow] = useState("hands");

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
        setShow("hands");
        setBannerText("Welcome to My Spaceship!");
      },
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.happyHand.reset();
        actions.happyHand.repetitions = 1;
        actions.happyHand.clampWhenFinished = true;
        actions.happyHand.play();
        actions.happyHand.fadeIn(0.1);
        last = actions.happyHand;
        setBannerText("My name is Lok Lok.");
        setShow("orb");
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
        setBannerText("This is a place \nfor You to be You.");
      },
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.gesturePointer.reset();
        actions.gesturePointer.repetitions = 1;
        actions.gesturePointer.clampWhenFinished = true;
        actions.gesturePointer.play();
        actions.gesturePointer.fadeIn(0.1);
        last = actions.gesturePointer;

        //
        setBannerText(
          "You can add your social media accounts or websites here."
        );
      },
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.gesturePointer2.reset();
        actions.gesturePointer2.repetitions = 1;
        actions.gesturePointer2.clampWhenFinished = true;
        actions.gesturePointer2.play();
        actions.gesturePointer2.fadeIn(0.1);
        last = actions.gesturePointer2;
      },

      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.spin.reset();
        actions.spin.repetitions = 1;
        actions.spin.clampWhenFinished = true;
        actions.spin.play();
        actions.spin.fadeIn(0.1);
        last = actions.spin;

        setBannerText("You can customize your own avatar.");
      },

      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.happyIdle.reset();
        actions.happyIdle.repetitions = 1;
        actions.happyIdle.clampWhenFinished = true;
        actions.happyIdle.play();
        actions.happyIdle.fadeIn(0.1);
        last = actions.happyIdle;

        setBannerText("You can also visit your friend's place.");
      },
      () => {
        if (last) {
          last?.fadeOut(0.1);
        }
        actions.handForward.reset();
        actions.handForward.repetitions = 1;
        actions.handForward.clampWhenFinished = true;
        actions.handForward.fadeIn(0.1);
        actions.handForward.play();
        last = actions.handForward;

        //
        setBannerText("Enjoy your time here!");
      },

      () => {
        if (last) {
          last?.fadeOut(0.1);
        }

        actions.greetings.reset();
        actions.greetings.repetitions = 1;
        actions.greetings.clampWhenFinished = true;
        actions.greetings.fadeIn(0.1);
        actions.greetings.play();
        last = actions.greetings;

        //
        setBannerText("See you around!");
      },
      //
      //
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

        //
        setBannerText("Thank you for Visiting!");
      },
      //
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

  let lookAtCam = new Vector3();
  useFrame((st, dt) => {
    lookAtCam.copy(st.camera.position);
    if (ref.current) {
      lookAtCam.y = ref.current.position.y;
      ref.current.lookAt(lookAtCam);
    }
    if (banner.current) {
      banner.current.lookAt(lookAtCam);
    }
  });

  return (
    <group>
      <Text
        ref={banner}
        position={[0, 2, 0.5]}
        textAlign={"center"}
        anchorX={"center"}
        anchorY={"bottom"}
        maxWidth={2}
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

      <group ref={ref}>
        <pointLight position={[0, 0, 10]} intensity={30}></pointLight>

        {show === "hands" && <HelloSign avatar={avatar}></HelloSign>}
      </group>

      {/* <group position={[0, 5, 30]}>{<Portal avatar={avatar}></Portal>}</group> */}
    </group>
  );
}

/*
Hips
Spine
Spine1
Spine2
Neck
Head
HeadTop_End
LeftEye
RightEye
LeftShoulder
LeftArm
LeftForeArm
LeftHand
LeftHandThumb1
LeftHandThumb2
LeftHandThumb3
LeftHandThumb4
LeftHandIndex1
LeftHandIndex2
LeftHandIndex3
LeftHandIndex4
LeftHandMiddle1
LeftHandMiddle2
LeftHandMiddle3
LeftHandMiddle4
LeftHandRing1
LeftHandRing2
LeftHandRing3
LeftHandRing4
LeftHandPinky1
LeftHandPinky2
LeftHandPinky3
LeftHandPinky4
RightShoulder
RightArm
RightForeArm
RightHand
RightHandThumb1
RightHandThumb2
RightHandThumb3
RightHandThumb4
RightHandIndex1
RightHandIndex2
RightHandIndex3
RightHandIndex4
RightHandMiddle1
RightHandMiddle2
RightHandMiddle3
RightHandMiddle4
RightHandRing1
RightHandRing2
RightHandRing3
RightHandRing4
RightHandPinky1
RightHandPinky2
RightHandPinky3
RightHandPinky4
LeftUpLeg
LeftLeg
LeftFoot
LeftToeBase
LeftToe_End
RightUpLeg
RightLeg
RightFoot
RightToeBase
RightToe_End
*/
