import React, { useEffect, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { HelloSign } from "./HelloSign";
import { Portal } from "./Portal";
import { Social } from "./Social";
import { ByeSign } from "./ByeSign";

export function Sequencer({ avatar, mixer, actions, envMap }) {
  let ref = useRef();
  let banner = useRef();
  let [text, setBannerText] = useState("Welcome to Your Card!");
  let [show, setShow] = useState("hands");

  useEffect(() => {
    mixer.stopAllAction();
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
        setShow("hi");
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
        setShow("none");
        setBannerText("I'm Lok Lok.");
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
        setShow("none");
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
        setShow("social");
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

      // () => {
      //   if (last) {
      //     last?.fadeOut(0.1);
      //   }
      //   actions.spin.reset();
      //   actions.spin.repetitions = 1;
      //   actions.spin.clampWhenFinished = true;
      //   actions.spin.play();
      //   actions.spin.fadeIn(0.1);
      //   last = actions.spin;

      //   setShow("avatar");
      //   setBannerText("You can customize your own avatar.");
      // },

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

        setShow("visit");
        setBannerText("You can also visit your friend's place with portals.");
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
        setShow("enjoy");
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
        setShow("bye");
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
        setShow("bye");
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

  let facingToCamera = new Vector3();
  useFrame((st, dt) => {
    facingToCamera.copy(st.camera.position);
    if (ref.current) {
      facingToCamera.y = ref.current.position.y;
      ref.current.lookAt(facingToCamera);
    }
    if (banner.current) {
      banner.current.lookAt(facingToCamera);
    }
  });

  return (
    <group>
      <group ref={ref}>
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
          color={"white"}
          outlineColor={"#555555"}
          outlineWidth={0.001}
          userData={{ enableBloom: true }}
        >
          {text}
          <meshBasicMaterial
            attach="material"
            side={DoubleSide}
            envMap={envMap}
            transparent={true}
            opacity={1}
          />
        </Text>

        <pointLight position={[0, 0, 10]} intensity={25}></pointLight>

        <HelloSign visible={show === "hi"} avatar={avatar}></HelloSign>
        <ByeSign visible={show === "bye"} avatar={avatar}></ByeSign>

        <group visible={show === "social"}>
          <Social avatar={avatar}></Social>
        </group>

        <group visible={show === "visit"}>
          <Portal avatar={avatar}></Portal>
        </group>
      </group>
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
