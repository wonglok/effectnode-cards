//
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useThree } from "@react-three/fiber";
import { getGPUTier } from "detect-gpu";
import { Suspense } from "react";
import { LoadingScreen } from "../vfx-content/welcome-page/LoadingScreen";
import { Preload, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import {
  Map3D,
  SimpleBloomer,
  StarSky,
  TailCursor,
  TheHelper,
  UserContorls,
} from "../vfx-metaverse";
import { useShaderEnvLight } from "../vfx-content/welcome-page/useShaderEnvLight";
import { Now } from "../vfx-metaverse/lib/Now";
import { SceneDecorator } from "../vfx-metaverse/compos/SceneDecorator";
import { NPCHelper } from "../vfx-content/storymaker-page/NPCHelper";
// import { AvatarSlots } from "../vfx-content/storymaker-page/AvatarSlots";
// import { WelcomeAvatar } from "../vfx-content/welcome-page/WelcomeAvatar";
import { Color, Object3D, TextureFilter } from "three";
import { getFirebase } from "../vfx-firebase/firelib";
// import { HoneyShip } from "../vfx-content/welcome-page/HoneyShip";
// import { LoginBall } from "../vfx-content/welcome-page/LoginBall";
// import { LoginGate } from "../vfx-cms/common/LoginGate";

export default function Page() {
  return (
    <group>
      <StarSky></StarSky>

      <Suspense fallback={<LoadingScreen></LoadingScreen>}>
        <Content3D></Content3D>
      </Suspense>
    </group>
  );
}

function UseBG() {
  let { scene } = useThree();
  useEffect(() => {
    let orig = scene.background;
    scene.background = new Color("#000");
    return () => {
      scene.background = orig;
    };
  });

  //
  return null;
}

export function Content3D() {
  let { envMap } = useShaderEnvLight({});
  let [collider, setCollider] = useState(false);
  let mapGLTF = useGLTF(`/map/GenesisCard/GenesisCard.glb`);
  // let avaGLTF1 = useGLTF(
  //   `https://d1a370nemizbjq.cloudfront.net/18bc89a8-de85-4a28-b3aa-d1ce4096059f.glb`
  // );
  // let avaGLTF2 = useGLTF(
  //   `https://d1a370nemizbjq.cloudfront.net/08cf5815-ab1d-4b6f-ab5e-5ec1858ec885.glb`
  // );

  let map = useMemo(() => {
    let map = mapGLTF.scene;
    // let map = SkeletonUtils.clonew(mapGLTF.scene);
    return map;
  }, [mapGLTF]);

  let o3d = new Object3D();
  return (
    <group>
      <UseBG></UseBG>

      <mesh
        onClick={() => {
          let router = require("next/router").default;
          router.push(`/card/${router.query.cardID}/outfit`);
        }}
        position={[-6.7, 1, 9.3]}
        userData={{
          onClick: () => {
            let router = require("next/router").default;
            router.push(`/card/${router.query.cardID}/outfit`);
          },
          hint: "Avatar Outfit",
        }}
      >
        {/*  */}
        <sphereBufferGeometry args={[0.3, 23, 23]}></sphereBufferGeometry>
        <meshStandardMaterial
          metalness={1}
          roughness={0.0}
          envMap={envMap}
          color="#ffff44"
        ></meshStandardMaterial>
      </mesh>

      {/* <SimpleBloomer></SimpleBloomer> */}

      {/*  */}
      <Map3D
        onReadyCollider={({ collider }) => {
          setCollider(collider);
        }}
        object={map}
      ></Map3D>

      {createPortal(<primitive object={map}></primitive>, o3d)}
      <primitive object={o3d}></primitive>

      {/* {collider && <primitive object={collider}></primitive>} */}

      {map && (
        <group>
          <SceneDecorator object={map}></SceneDecorator>

          <UserContorls
            higherCamera={-0.6}
            avatarSpeed={0.9}
            Now={Now}
          ></UserContorls>

          <MySelf
            isSwim={true}
            enableLight={true}
            collider={collider}
            envMap={envMap}
            map={map}
          ></MySelf>

          {/*
          {collider && (
            <group position={[-1, 0, 0]}>
              <NPCHelper
                isSwim={false}
                avatarGLTF={avaGLTF1}
                collider={collider}
                envMap={envMap}
                map={map}
              ></NPCHelper>
            </group>
          )} */}
          {/* {map && <AvatarSlots envMap={envMap} map={map}></AvatarSlots>} */}

          {collider && (
            <group>
              <TailCursor Now={Now} color={"#ffffff"}></TailCursor>

              <TheHelper Now={Now}></TheHelper>
            </group>
          )}
        </group>
      )}
    </group>
  );
}

function MySelf({ envMap, map, collider, isSwim = true, enableLight = true }) {
  let [url, setURL] = useState(false);

  useEffect(() => {
    return getFirebase()
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user && user.uid) {
          let snap = await getFirebase()
            .database()
            .ref(`/profiles/${user.uid}`)
            .get();
          let val = snap.val();

          if (val && val.avatarURL) {
            setURL(val.avatarURL);
          } else {
          }
        }
      });
  }, []);

  return (
    <group>
      {url && (
        <Suspense fallback={null}>
          <MyNPC
            url={url}
            enableLight={enableLight}
            isSwim={isSwim}
            collider={collider}
            envMap={envMap}
            map={map}
          ></MyNPC>
        </Suspense>
      )}
    </group>
  );
}

function MyNPC({ url, enableLight, isSwim, envMap, map, collider }) {
  let avaGLTF = useGLTF(url);

  return (
    <group>
      {collider && (
        <group position={[0, 0, 0]}>
          <NPCHelper
            enableLight={enableLight}
            isSwim={isSwim}
            avatarGLTF={avaGLTF}
            collider={collider}
            envMap={envMap}
            map={map}
            lighting={false}
          ></NPCHelper>
        </group>
      )}
    </group>
  );
}
