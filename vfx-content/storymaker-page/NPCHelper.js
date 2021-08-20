// import { Text } from "@react-three/drei";
// import { createPortal, useFrame, useThree } from "@react-three/fiber";
// import { useRef, useState } from "react";
// import { BackSide, SphereBufferGeometry, Vector2, Vector3 } from "three";

import { Box, Sphere, Text, useFBX, useGLTF } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimationMixer, Object3D, Vector3 } from "three";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { useMiniEngine } from "../../vfx-metaverse";
import { MapNPC } from "../../vfx-metaverse/lib/MapNPC";
import { Now } from "../../vfx-metaverse/lib/Now";
import { makeNow } from "../../vfx-metaverse/utils/make-now";

// const visibleHeightAtZDepth = (depth, camera, offset) => {
//   // compensate for cameras not positioned at z=0
//   const cameraOffset = offset;
//   if (depth < cameraOffset) depth -= cameraOffset;
//   else depth += cameraOffset;

//   // vertical fov in radians
//   const vFOV = (camera.fov * Math.PI) / 180;

//   // Math.abs to ensure the result is always positive
//   return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
// };

// const visibleWidthAtZDepth = (depth, camera, offset) => {
//   const height = visibleHeightAtZDepth(depth, camera, offset);
//   return height * camera.aspect;
// };

export function NPCHelper({ avatarGLTF, envMap, collider }) {
  let { get } = useThree();

  //
  let NPC = useMemo(() => makeNow(), []);
  let group = useRef();
  let { mini } = useMiniEngine();

  useEffect(() => {
    let npc = new MapNPC({
      Now: NPC,
      collider,
      startAt: Now.avatarAt,
    });

    mini.onLoop(() => {
      npc.onSimulate();
    });

    return () => {};
  }, [mini]);

  let wp = new Vector3();
  let dir = new Vector3();
  let dir2 = new Vector3();
  useFrame(({ camera }) => {
    NPC.avatarSpeed = 0.35;
    NPC.goingTo.set(
      Number((Now.cursorPos.x * 1).toFixed(0) / 1),
      Number((Now.cursorPos.y * 1).toFixed(0) / 1),
      Number((Now.cursorPos.z * 1).toFixed(0) / 1)
    );

    let gp = group.current;
    let ava = gp.getObjectByName("avatar");
    if (gp && ava) {
      gp.position.set(
        //
        //
        NPC.avatarAt.x,
        NPC.avatarAt.y,
        NPC.avatarAt.z
        //
        //
      );

      if (NPC.avatarMode === "standing") {
        ava.getWorldPosition(wp);
        dir.set(camera.position.x, wp.y, camera.position.z);
        dir2.lerp(dir, 0.0023);
        ava.lookAt(dir2);
      } else {
        ava.getWorldPosition(wp);
        dir.fromArray([NPC.goingTo.x, wp.y, NPC.goingTo.z]);
        dir2.lerp(dir, 0.1);
        ava.lookAt(dir2);
      }
    }
  });

  return (
    <group ref={group}>
      {/*  */}
      {/*  */}
      {/*  */}

      <group position={[0, -2.31 + 0.1, 0]}>
        {/* <Suspense
          fallback={<Sphere position={[0, 1, 0]} args={[0.3, 23, 23]}></Sphere>}
        > */}
        <DreamyHelper avatarGLTF={avatarGLTF} npc={NPC}></DreamyHelper>
        {/* </Suspense> */}
      </group>

      {/*  */}
    </group>
  );
}

function DreamyHelper({ avatarGLTF, npc }) {
  let avatar = useMemo(() => {
    let scene = avatarGLTF.scene;
    scene.visible = false;
    scene.traverse((it) => {
      it.frustumCulled = false;
      it.castShadow = true;
    });
    return scene;
  }, [avatarGLTF, avatarGLTF.scene]);

  useEffect(() => {
    let last = avatar;
    return () => {
      last.visible = false;
    };
  }, []);

  let mixer = useMemo(() => {
    return new AnimationMixer(avatar);
  }, [avatar]);

  let fbx = {
    // running: useFBX(`/rpm-actions-locomotion/running.fbx`),
    // standing: useFBX(`/rpm-actions-locomotion/standing.fbx`),
    running: useFBX(`/rpm-actions-locomotion/swim-forward.fbx`),
    standing: useFBX(`/rpm-actions-locomotion/swim-float.fbx`),
  };
  let actions = useMemo(() => {
    let obj = {};
    for (let kn in fbx) {
      obj[kn] = mixer.clipAction(fbx[kn].animations[0]);
    }
    return obj;
  }, [fbx]);

  useEffect(() => {
    let last = false;
    npc.avatarMode = "running";
    npc.avatarMode = "standing";

    return npc.onEvent("avatarMode", () => {
      let current = actions[npc.avatarMode];
      if (last && last !== current) {
        last.fadeOut(0.2);
      }
      last = current;

      if (npc.avatarMode) {
      }

      current.reset();
      current.play();
      current.fadeIn(0.2);

      setTimeout(() => {
        avatar.visible = true;
      }, 100);
    });
  }, [avatar]);

  useFrame((st, dt) => {
    mixer.update(dt);
  });

  return (
    <group>
      <primitive name="avatar" object={avatar}>
        <pointLight
          castShadow={true}
          intensity={6.5}
          position={[0, 1.75, 1.75]}
        ></pointLight>
      </primitive>
    </group>
  );
}
