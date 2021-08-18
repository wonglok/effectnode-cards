import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { MathUtils } from "three";
import { useAutoEvent } from "../utils/use-auto-event";
import { Tooltip } from "./Tooltip";

export function TheHelper({ Now }) {
  return (
    <group>
      <TheCursor Now={Now}></TheCursor>
      <ClickToOpen Now={Now}></ClickToOpen>
      <Tooltip Now={Now}></Tooltip>
      <HideCursor></HideCursor>
    </group>
  );
}

function TheCursor({ Now }) {
  let core = useRef();
  let orbit = useRef();

  let mouse1 = useRef();

  useAutoEvent("set-tail-state", ({ detail: state }) => {
    if (mouse1.current) {
      if (state === "hovering") {
        mouse1.current.userData.enableBloom = true;
      } else {
        mouse1.current.userData.enableBloom = false;
      }
    }
  });

  useFrame(({ camera }) => {
    if (core.current) {
      core.current.position.copy(camera.position);
      core.current.rotation.copy(camera.rotation);
    }
  });

  return (
    <group>
      <group ref={core}>
        <group ref={orbit} scale={[1, 1, 1]} position={[0, 0, -1]}>
          <group scale={0.0007} rotation={[0, 0, Math.PI * 0.25]}>
            <Floating Now={Now}>
              {/*  */}
              <mesh ref={mouse1} position={[0, -9 / 2, 0]}>
                <coneBufferGeometry args={[4, 9, 3, 1]}></coneBufferGeometry>
                <meshStandardMaterial
                  //
                  metalness={1.0}
                  roughness={0.0}
                ></meshStandardMaterial>
              </mesh>
            </Floating>
          </group>
        </group>
      </group>
    </group>
  );
}

function Floating({ Now, children }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    let time = clock.getElapsedTime();
    if (ref.current) {
      //
      let target = 0;
      if (Now?.hoverData?.website) {
        target = -3 + Math.cos(time * 5.0) * 3;
      }
      ref.current.position.y = MathUtils.lerp(
        ref.current.position.y,
        target,
        0.5
      );
    }
  });
  //
  return <group ref={ref}>{children}</group>;
}

function ClickToOpen({ Now }) {
  let { gl } = useThree();

  let move = 0;
  let isDown = false;
  useAutoEvent(
    "pointerdown",
    () => {
      isDown = true;
      move = 0;
    },
    { passive: false },
    gl.domElement
  );

  useAutoEvent(
    "pointermove",
    () => {
      if (isDown) {
        move++;
      }
    },
    { passive: false },
    gl.domElement
  );

  useAutoEvent(
    "pointerup",
    () => {
      //
      if (Now && move <= 10) {
        if (Now?.hoverData?.website && isDown) {
          isDown = false;
          let href = document.createElement("a");
          href.href = Now.hoverData.website;
          href.target = "_blank";
          href.click();
        }
      }
      //
    },
    { passive: false },
    gl.domElement
  );

  return null;
}

function HideCursor() {
  useAutoEvent(
    "pointerdown",
    () => {
      document.body.style.cursor = "none";
    },
    { passive: false },
    document.body
  );
  useAutoEvent(
    "pointerup",
    () => {
      document.body.style.cursor = "grabbing";
    },
    { passive: false },
    document.body
  );

  useEffect(() => {
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = "";
    };
  }, []);
  return null;
}

// they have meta verses i have bible verses
