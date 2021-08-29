import { Text, useGLTF } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimationMixer, DoubleSide, Object3D } from "three";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { getFirebase, onReady } from "../../vfx-firebase/firelib";

import { makeShallowStore } from "../../vfx-utils/make-shallow-store";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { useEnvLight } from "../../vfx-content/Use/useEnvLight.js";
import { Actions } from "../Actions/Actions";
import router from "next/router";

export const makePlayBack = () => {
  return makeShallowStore({
    reload: false,
    autoPlayNext: true,
    actionKey: false,
    cursor: 0,
  });
};

export function MySelf({ envMap, holder, PlaybackState }) {
  let [url, setURL] = useState(false);

  useEffect(async () => {
    let snap = await getFirebase()
      .database()
      .ref(`/card-avatar-info/${router.query.cardID}`)
      .get();
    let val = snap.val();
    if (val && val.avatarURL) {
      setURL(`${val.avatarURL}?avatarSignature=${val.avatarSignature}`);
    } else {
    }
  }, []);

  return (
    <group>
      {url && (
        <Suspense fallback={<LoadingAvatar></LoadingAvatar>}>
          <AvatarItem
            holder={holder}
            envMap={envMap}
            url={url}
            PlaybackState={PlaybackState}
          ></AvatarItem>
        </Suspense>
      )}
    </group>
  );
}

export function LoadingAvatar() {
  let { camera } = useThree();

  return (
    <Text
      scale={0.7}
      fontSize={0.25}
      color="black"
      outlineColor="white"
      outlineWidth={0.002}
      position={[0, camera.position.y, 0]}
      lookAt={[camera.position.x, camera.position.y, camera.position.z]}
    >
      Loading....
    </Text>
  );
}

function AvatarItem({ url, holder, PlaybackState, envMap }) {
  let o3d = new Object3D();
  o3d.name = "avatar";

  let gltf = useGLTF(`${url}`);
  let avatar = useMemo(() => {
    let cloned = SkeletonUtils.clone(gltf.scene);
    return cloned;
  }, []);

  avatar.rotation.set(0, 0, 0);
  avatar.position.set(0, 0, 0);

  return (
    <group>
      {createPortal(<primitive object={avatar}></primitive>, o3d)}
      <primitive position={[0, 0, 0]} object={o3d}></primitive>

      <Suspense fallback={null}>
        <Rig
          holder={holder}
          avatar={avatar}
          PlaybackState={PlaybackState}
          envMap={envMap}
        ></Rig>
      </Suspense>
      <Decorate avatar={avatar}></Decorate>
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

function Rig({ avatar, holder, PlaybackState, envMap }) {
  let [sentences, setActions] = useState([]);
  useEffect(() => {
    if (router?.query?.cardID) {
      let clean = [];
      onReady().then(async ({ db, user }) => {
        //
        let sentences = db
          .ref(`/card-stroy-draft`)
          .child(router.query.cardID)
          .child(holder)
          .child("sentences");

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
    }
  }, []);

  let mixer = useMemo(() => {
    return new AnimationMixer(avatar);
  }, [avatar]);

  useFrame((st, dt) => {
    if (dt <= 1 / 60) {
      dt = 1 / 60;
    }
    mixer.update(dt);
  });

  return (
    <group>
      {sentences.length > 0 && (
        <group>
          <Sequncer
            mixer={mixer}
            avatar={avatar}
            sentences={sentences}
            PlaybackState={PlaybackState}
            envMap={envMap}
          ></Sequncer>
        </group>
      )}
    </group>
  );
}

function Sequncer({ avatar, mixer, sentences, PlaybackState, envMap }) {
  PlaybackState.makeKeyReactive("reload");

  useEffect(() => {
    avatar.visible = false;
    mixer.stopAllAction();
    let last = false;
    let weakMap = new WeakMap();
    let cleans = [];
    let onClean = (v) => cleans.push(v);

    let stopped = false;
    onClean(() => {
      stopped = true;
    });
    onClean(() => {
      weakMap = new WeakMap();
      mixer.stopAllAction();
    });

    let doAction = ({ fbx, actionInfo }) => {
      if (stopped) {
        return;
      }
      avatar.visible = true;
      if (last) {
        last.fadeOut(0.1);
      }

      let action = false;
      if (!weakMap.has(fbx)) {
        action = mixer.clipAction(fbx.animations[0], avatar);
        weakMap.set(fbx, action);
      } else {
        action = weakMap.get(fbx);
      }
      action.reset();

      if (PlaybackState.forceLoopActions) {
        action.repetitions = Infinity;
        action.clampWhenFinished = false;
      } else {
        action.repetitions = actionInfo.repeat || 1;
        action.clampWhenFinished = true;
      }

      action.play();
      last = action;
      onClean(() => {
        action.stop();
      });
    };

    let loadActionFBX = (index) => {
      return new Promise((resolve) => {
        let sentence = sentences[index];

        if (!sentence) {
          PlaybackState.cursor = 0;
          PlaybackState.forceLoopActions = false;
          PlaybackState.autoPlayNext = true;
          PlaybackState.reload = Math.random();
          return;
        }

        let actionInfo = Actions.find(
          (e) => e.signature === sentence.fireval.signature
        );

        if (actionInfo) {
          new FBXLoader().load(actionInfo.url, (fbx) => {
            resolve({ fbx, actionInfo, firekey: sentence.firekey });
          });
        }
      });
    };

    let loop = async (info) => {
      if (stopped) {
        return;
      }
      if (!info) {
        info = await loadActionFBX(PlaybackState.cursor);
        if (stopped) {
          return;
        }
      }

      if (info) {
        let { fbx, actionInfo, firekey } = info;
        PlaybackState.actionKey = firekey;
        doAction({ fbx, actionInfo });

        let preload = PlaybackState.cursor + 1;
        preload = preload % sentences.length;
        let preloadNextProm = loadActionFBX(preload);

        let finished = () => {
          if (stopped) {
            return;
          }

          mixer.removeEventListener("finished", finished);

          preloadNextProm.then((v) => {
            if (stopped) {
              return;
            }
            if (PlaybackState.autoPlayNext) {
              PlaybackState.cursor++;
              PlaybackState.cursor = PlaybackState.cursor % sentences.length;

              loop(v);
            }
          });
        };
        mixer.addEventListener("finished", finished);
        onClean(() => {
          mixer.removeEventListener("finished", finished);
        });
      }
    };

    loop();

    return () => {
      mixer.stopAllAction();
      cleans.forEach((c) => c());
    };
  }, [sentences, PlaybackState.reload]);

  return (
    <group>
      {createPortal(
        <DisplaySentence
          sentences={sentences}
          PlaybackState={PlaybackState}
          envMap={envMap}
        ></DisplaySentence>,
        avatar
      )}
    </group>
  );
}

function DisplaySentence({ sentences, PlaybackState, envMap = null }) {
  PlaybackState.makeKeyReactive("cursor");
  let text = sentences[PlaybackState.cursor]?.fireval?.sentence;

  return (
    <group position={[0, 1.9, 0]}>
      {text && (
        <Text
          position={[0, 0, 0.5]}
          textAlign={"center"}
          anchorX={"center"}
          anchorY={"bottom"}
          maxWidth={2}
          fontSize={0.12}
          font={`/font/Cronos-Pro-Light_12448.ttf`}
          frustumCulled={false}
          color={"white"}
          outlineColor={"black"}
          outlineWidth={0.005}
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
      )}
    </group>
  );
}
