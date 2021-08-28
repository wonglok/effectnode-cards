//
import { useEffect, useMemo, useState } from "react";
import { createPortal, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { LoadingScreen } from "../vfx-content/welcome-page/LoadingScreen";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import {
  Map3D,
  StarSky,
  TailCursor,
  TheHelper,
  UserContorls,
} from "../vfx-metaverse";
import { useShaderEnvLight } from "../vfx-content/welcome-page/useShaderEnvLight";
import { Now } from "../vfx-metaverse/lib/Now";
import { SceneDecorator } from "../vfx-metaverse/compos/SceneDecorator";
import { Color, Object3D } from "three";
import { AvatarPortal } from "../vfx-content/AvatarPortal/AvatarPortal";
import { LoginGateR3F } from "../vfx-content/LoginGateR3F/LoginGateR3F";
import { LoginBall } from "../vfx-content/welcome-page/LoginBall";
import { MySelf } from "../vfx-content/MySelf/MySelf";
import { StoryPortal } from "../vfx-content/StoryPortal/StoryPortal";

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

  let map = useMemo(() => {
    // let map = mapGLTF.scene;
    let map = SkeletonUtils.clone(mapGLTF.scene);
    return map;
  }, [mapGLTF]);

  let o3d = new Object3D();
  return (
    <group>
      {createPortal(<primitive object={map}></primitive>, o3d)}
      <primitive object={o3d}></primitive>
      {/* {collider && <primitive object={collider}></primitive>} */}
      <directionalLight intensity={2} position={[0, 3, 3]}></directionalLight>
      <UseBG></UseBG>

      <group rotation={[0, Math.PI * 0.5, 0]} position={[-6.7, 1, 2 + 9.3]}>
        <LoginBall></LoginBall>
      </group>

      <LoginGateR3F>
        <group position={[-6.7, 1, 9.3]}>
          <AvatarPortal></AvatarPortal>
        </group>

        <group rotation={[0, Math.PI * 0.5, 0]} position={[-6.7, 1, 1 + 9.3]}>
          {/*  */}
          <StoryPortal></StoryPortal>
        </group>

        {collider && (
          <MySelf
            isSwim={true}
            enableLight={true}
            collider={collider}
            envMap={envMap}
            map={map}
            distance={6.5}
          ></MySelf>
        )}
      </LoginGateR3F>

      {map && (
        <group>
          <Map3D
            onReadyCollider={({ collider }) => {
              setCollider(collider);
            }}
            object={map}
          ></Map3D>

          {collider && (
            <group>
              <UserContorls
                higherCamera={-0.7}
                avatarSpeed={0.9}
                Now={Now}
              ></UserContorls>

              <SceneDecorator object={map}></SceneDecorator>
              <TailCursor Now={Now} color={"#ffffff"}></TailCursor>
              <TheHelper Now={Now}></TheHelper>
            </group>
          )}
        </group>
      )}
    </group>
  );
}
