import { Text, useGLTF } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimationMixer, BackSide, Object3D, Vector3 } from "three";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getFirebase, onReady } from "../../vfx-firebase/firelib";

import { makeShallowStore } from "../../vfx-utils/make-shallow-store";

import { useEnvLight } from "../../vfx-content/Use/useEnvLight.js";
import { Actions } from "../Actions/Actions";
import router, { useRouter } from "next/router";
import { LoadingAvatar, MySelf } from "./MySelf";

export function TellStoryCanvas({ holder = "handy-editor" }) {
  return (
    <div className="h-full w-full relative flex flex-col lg:flex-row">
      <div className=" order-2 h-52  lg:h-full overflow-scroll lg:w-3/12">
        <SentencesList holder={holder}></SentencesList>
        {/*  */}
      </div>
      <Canvas
        className="  lg:order-3 lg:w-9/12"
        concurrent
        onCreated={(st) => {
          st.gl.physicallyCorrectLights = true;
        }}
        dpr={[1, 3]}
      >
        <Suspense fallback={<LoadingAvatar></LoadingAvatar>}>
          <Content holder={holder}></Content>
        </Suspense>
      </Canvas>
    </div>
  );
}

// card-stroy-draft
export let ThisUI = makeShallowStore({
  reload: false,
  autoPlayNext: true,
  actionKey: false,
  cursor: 0,
});

function Content({ holder }) {
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

      <MySelf envMap={envMap} holder={holder}></MySelf>
      <MyCamera></MyCamera>
    </group>
  );
}

let addSentence = ({ router, holder }) => {
  onReady().then(async ({ db, user }) => {
    //
    let draft = db
      .ref(`/card-stroy-draft`)
      .child(router.query.cardID)
      .child(holder)
      .child("sentences");
    let newObj = draft.push();

    let snap = await draft.get();
    let num = snap.numChildren();

    newObj.set({
      order: num + 1,
      signature: Actions[0].signature,
      sentence: "Hello! Welcome to my Story",
      repeat: 1,
      addons: [],
    });
  });
};

function SentencesList({ holder }) {
  let router = useRouter();

  let [actions, setActions] = useState([]);
  useEffect(() => {
    let clean = [];
    onReady().then(async ({ db, user }) => {
      //
      let sentences = db
        .ref(`/card-stroy-draft`)
        .child(router.query.cardID)
        .child(holder)
        .child("sentences");

      let snap = await sentences.get();
      let num = snap.numChildren();

      // console.log(num);

      if (num === 0) {
        addSentence({ router, holder });
      }

      let cleanup = sentences.on("value", (snapshot) => {
        if (snapshot) {
          let arr = [];
          snapshot.forEach((sub) => {
            if (sub) {
              arr.push({
                firekey: sub.key,
                fireval: sub.val(),
              });
            }
          });
          setActions(arr);
        }
      });

      clean.push(cleanup);
    });

    return () => {
      clean.forEach((e) => e());
    };
  }, []);

  return (
    <div>
      <CreateSentence holder={holder}></CreateSentence>
      <PlaybackControls></PlaybackControls>
      {actions.map((a, idx) => {
        return (
          <Sentence
            idx={idx}
            key={a.firekey}
            firekey={a.firekey}
            data={a.fireval}
            holder={holder}
          ></Sentence>
        );
      })}
    </div>
  );
}

function CreateSentence({ holder }) {
  let router = useRouter();
  return (
    <div
      className="p-3"
      onClick={() => {
        addSentence({ router, holder });
      }}
    >
      + Add Sentence
    </div>
  );
}

function PlaybackControls() {
  ThisUI.makeKeyReactive("autoPlayNext");
  ThisUI.makeKeyReactive("reload");
  return (
    <div className="p-3">
      <div
        className={`inline-block p-3 mr-3 ${
          ThisUI.autoPlayNext ? "text-green-500" : "text-purple-500"
        }`}
      >
        AutoPlay: {ThisUI.autoPlayNext ? "ON" : "OFF"}
      </div>
      <div
        className="inline-block p-3 border cursor-pointer bg-green-400  text-white rounded-xl mr-3"
        onClick={() => {
          ThisUI.forceLoopActions = false;
          ThisUI.autoPlayNext = true;
          ThisUI.reload = Math.random();
        }}
      >
        Reset
      </div>
    </div>
  );
}

function Sentence({ data, holder, firekey, idx }) {
  ThisUI.makeKeyReactive("actionKey");
  return (
    <div
      onClick={() => {
        ThisUI.autoPlayNext = false;
        ThisUI.cursor = idx;
        ThisUI.forceLoopActions = Infinity;
        ThisUI.reload = Math.random();
      }}
      className={
        (ThisUI.actionKey === firekey
          ? ThisUI.autoPlayNext
            ? "bg-green-200"
            : "bg-purple-200"
          : "") + ` px-3 py-3`
      }
    >
      <select
        defaultValue={data.signature}
        onChange={(ev) => {
          onReady().then(({ db, user }) => {
            db.ref(`/card-stroy-draft`)
              .child(router.query.cardID)
              .child(holder)
              .child("sentences")
              .child(firekey)
              .child("signature")
              .set(ev.target.value);
          });
        }}
      >
        {Actions.map((act) => {
          return (
            <option key={act.signature} value={act.signature}>
              {act.name}
            </option>
          );
        })}
      </select>
      {/* <pre>{JSON.stringify(data)}</pre> */}
    </div>
  );
}

function MyCamera({ actions }) {
  let { camera } = useThree();
  useEffect(() => {
    camera.near = 0.1;
    camera.far = 5000;
    camera.fov = 35;
    camera.updateProjectionMatrix();
  }, [camera]);

  let lookAt = new Vector3(0, 0, 0);
  let lookAtlerp = new Vector3(0, 0, 0);
  let lookAtInfluence = new Object3D();
  let lookAtInfluenceNow = new Object3D();
  let corePos = new Vector3();

  useFrame(({ get }) => {
    let { camera, scene, mouse } = get();

    camera.position.x = 0;
    camera.position.y = 1.5;
    camera.position.z = 10;

    let avatar = scene.getObjectByName("avatar");
    if (avatar) {
      let coreTarget = avatar.getObjectByName("Head");
      if (coreTarget) {
        coreTarget.getWorldPosition(corePos);

        //
        lookAt.set(mouse.x * 30, mouse.y * 30, 50);
        lookAtlerp.lerp(lookAt, 0.3);
        lookAtInfluence.lookAt(lookAtlerp);

        lookAtInfluenceNow.quaternion.slerp(lookAtInfluence.quaternion, 0.3);
        coreTarget.quaternion.slerp(lookAtInfluenceNow.quaternion, 0.3);
      }
    }
  });
  return <group></group>;
}
