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
import { LoadingAvatar, makePlayBack, MySelf } from "./MySelf";

export function TellStoryCanvas({ holder = "handy-editor" }) {
  return (
    <div className="h-full w-full relative flex flex-col lg:flex-row">
      <div className=" order-2 h-5/6 lg:h-full overflow-scroll lg:w-3/12">
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
        <MyCamera></MyCamera>
      </Canvas>
    </div>
  );
}

// card-stroy-draft
export let PlayBackState = makePlayBack();

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

      <MySelf
        envMap={envMap}
        holder={holder}
        PlaybackState={PlayBackState}
      ></MySelf>
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
      className="p-3 py-4 lg:py-$ text-center boder bg-blue-400 text-white cursor-pointer"
      onClick={() => {
        addSentence({ router, holder });
        window.dispatchEvent(new Event("scroll-div-to-bottom"));
      }}
    >
      + Add Sentence
    </div>
  );
}

function PlaybackControls() {
  PlayBackState.makeKeyReactive("autoPlayNext");
  return (
    <div
      className={`p-3 text-center ${
        PlayBackState.autoPlayNext ? "bg-green-500" : "bg-purple-500"
      }`}
    >
      <div className={`inline-block p-3 mr-3 text-white`}>
        Playback: {PlayBackState.autoPlayNext ? "AutoPlay" : "Looping"}
      </div>
      <div
        className="inline-block py-1 p-3 border cursor-pointer bg-white  rounded-md mr-3"
        onClick={() => {
          PlayBackState.cursor = 0;
          PlayBackState.forceLoopActions = false;
          PlayBackState.autoPlayNext = true;
          PlayBackState.reload = Math.random();
        }}
      >
        Reset
      </div>
    </div>
  );
}

function Sentence({ data, holder, firekey, idx }) {
  let refTextArea = useRef();
  PlayBackState.makeKeyReactive("actionKey");
  PlayBackState.makeKeyReactive("autoPlayNext");

  let saveText = (text = "") => {
    onReady().then(({ db, user }) => {
      db.ref(`/card-stroy-draft`)
        .child(router.query.cardID)
        .child(holder)
        .child("sentences")
        .child(firekey)
        .child("sentence")
        .set(text.trim());
    });
  };

  useEffect(() => {
    let last = false;
    let tt = setInterval(() => {
      if (last && refTextArea.current) {
        if (last !== refTextArea.current.value) {
          saveText(refTextArea.current.value);
          last = refTextArea.current.value;
        }
      }
    }, 1000);

    return () => {
      last = false;
      clearInterval(tt);
    };
  }, []);

  return (
    <div
      onClick={() => {
        PlayBackState.autoPlayNext = false;
        PlayBackState.cursor = idx;
        PlayBackState.forceLoopActions = Infinity;
        PlayBackState.reload = Math.random();
      }}
      className={
        (PlayBackState.actionKey === firekey
          ? PlayBackState.autoPlayNext
            ? "bg-green-200"
            : "bg-purple-200"
          : "bg-gray-200") + ` px-3 py-3`
      }
    >
      <select
        className="mb-3"
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
      <button
        className="inline-block px-3 mx-3 bg-white text-black"
        onClick={() => {
          saveText(refTextArea.current.value);
        }}
      >
        Save
      </button>
      <textarea
        ref={refTextArea}
        className="w-full h-24 p-3"
        defaultValue={data.sentence}
        onKeyDown={(ev) => {
          if (ev.key.toLowerCase() === "s" && ev.metaKey) {
            ev.preventDefault();
            saveText(ev.target.value);
          }
          if (ev.key.toLowerCase() === "enter" && ev.metaKey) {
            ev.preventDefault();
            saveText(ev.target.value);
          }
        }}
      ></textarea>

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
    camera.position.z = 5;
    camera.lookAt(0, 1.4, 0);

    let avatar = scene.getObjectByName("avatar");
    if (avatar) {
      let coreTarget = avatar.getObjectByName("Head");
      if (coreTarget) {
        coreTarget.getWorldPosition(corePos);

        //
        lookAt.set(mouse.x * 30, mouse.y * 30 + corePos.y, 40);
        lookAtlerp.lerp(lookAt, 0.5);
        lookAtInfluence.lookAt(lookAtlerp);

        lookAtInfluenceNow.quaternion.slerp(lookAtInfluence.quaternion, 0.5);
        coreTarget.quaternion.slerp(lookAtInfluenceNow.quaternion, 0.5);
      }
    }
  });
  return <group></group>;
}
