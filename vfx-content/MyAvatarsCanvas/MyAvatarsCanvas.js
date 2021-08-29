import { Text, useFBX, useGLTF } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimationMixer, BackSide, Object3D, Vector3 } from "three";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getFirebase } from "../../vfx-firebase/firelib";

import { useEnvLight } from "../../vfx-content/Use/useEnvLight.js";
export function MyAvatarsCanvas() {
  return (
    <Canvas
      concurrent
      onCreated={(st) => {
        st.gl.physicallyCorrectLights = true;
      }}
      dpr={[1, 3]}
    >
      <Suspense fallback={<LoadingAvatar></LoadingAvatar>}>
        <Content></Content>
      </Suspense>
    </Canvas>
  );
}

function Content() {
  let { envMap } = useEnvLight({});

  return (
    <group>
      <pointLight intensity={30} position={[-10, 10, 10]}></pointLight>

      <directionalLight
        intensity={1}
        position={[10, 10, 10]}
      ></directionalLight>

      <directionalLight
        intensity={2}
        position={[-10, 10, -10]}
      ></directionalLight>

      <mesh position={[0, 0, 0]}>
        <sphereBufferGeometry args={[8, 32, 32]}></sphereBufferGeometry>
        <meshBasicMaterial
          envMap={envMap}
          side={BackSide}
          color={"#fff"}
        ></meshBasicMaterial>
      </mesh>

      <MySelf envMap={envMap}></MySelf>
    </group>
  );
}

export function MySelf({ envMap }) {
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
        <Suspense fallback={<LoadingAvatar></LoadingAvatar>}>
          <AvatarItem envMap={envMap} url={url}></AvatarItem>
        </Suspense>
      )}
    </group>
  );
}

function LoadingAvatar() {
  let { camera } = useThree();
  useEffect(() => {
    camera.position.y = 1.6;
    camera.position.z = 1;
    camera.lookAt(0, 1.6, 0.2);
  });

  return (
    <Text
      scale={0.7}
      fontSize={0.05}
      color="black"
      outlineColor="white"
      outlineWidth={0.002}
      position={[0, 1.6, 0.2]}
    >
      Loading....
    </Text>
  );
}

function AvatarItem({ url }) {
  let o3d = new Object3D();
  o3d.name = "avatar";

  let gltf = useGLTF(`${url}`);
  let avatar = useMemo(() => {
    let cloned = SkeletonUtils.clone(gltf.scene);
    return cloned;
  }, [gltf]);

  return (
    <group>
      {createPortal(<primitive object={avatar}></primitive>, o3d)}
      <primitive object={o3d}></primitive>
      <Rig avatar={avatar}></Rig>
      <Decorate avatar={avatar}></Decorate>

      <MyCamera></MyCamera>
    </group>
  );
}

function Decorate({ avatar }) {
  useEffect(() => {
    avatar.traverse((it) => {
      it.frustumCulled = false;
    });

    avatar.traverse((it) => {
      if (it.material) {
        it.material.envMapIntensity = 3;
      }
    });
  }, [avatar]);

  return null;
}
function Rig({ avatar }) {
  let mixer = useMemo(() => {
    return new AnimationMixer();
  }, []);
  let fbx = {
    // waiting: useFBX(`/rpm/rpm-pose/standing-waiting.fbx`),
    idle: useFBX(`/rpm/rpm-actions-locomotion/standing-foot.fbx`),
  };
  let actions = {};
  for (let kn in fbx) {
    actions[kn] = mixer.clipAction(fbx[kn].animations[0], avatar);
  }
  useFrame((st, dt) => {
    mixer.update(dt);
  });
  useEffect(() => {
    actions.idle.play();

    return () => {
      mixer.stopAllAction();
    };
  }, []);

  return <group></group>;
}

function MyCamera() {
  let { camera, gl } = useThree();
  let orbit = useMemo(() => {
    camera.near = 0.1;
    camera.far = 5000;
    camera.fov = 35;
    camera.updateProjectionMatrix();
    camera.position.z = 1;

    let orbit = new OrbitControls(camera, gl.domElement);
    orbit.minDistance = 0.4;
    orbit.maxDistance = 5.5;
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.1;
    orbit.zoomSpeed = 0.3;

    orbit.update();
    return orbit;
  }, []);

  let lookAt = new Vector3(0, 0, 0);
  let lookAtlerp = new Vector3(0, 0, 0);
  let lookAtInfluence = new Object3D();
  let lookAtInfluenceNow = new Object3D();
  let corePos = new Vector3();

  useFrame(({ get }) => {
    let { camera, scene, mouse } = get();

    let avatar = scene.getObjectByName("avatar");
    if (avatar) {
      let coreTarget = avatar.getObjectByName("Head");
      if (coreTarget) {
        coreTarget.getWorldPosition(corePos);
        orbit.target.lerp(corePos, 0.1);

        camera.position.y = orbit.target.y;
        camera.position.y += 0.2;
        orbit.update();

        lookAt.set(mouse.x * 15, mouse.y * 15, 15);
        lookAtlerp.lerp(lookAt, 0.2);
        lookAtInfluence.lookAt(lookAtlerp);

        lookAtInfluenceNow.quaternion.slerp(lookAtInfluence.quaternion, 0.2);
        coreTarget.quaternion.slerp(lookAtInfluenceNow.quaternion, 0.2);
      }
    }
  });

  return <group></group>;
}
