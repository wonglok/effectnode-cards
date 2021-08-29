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
  let [sentences, setActions] = useState([]);

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

        let cleanup = sentences.on("value", async (snapshot) => {
          if (snapshot) {
            let arr = [];
            let getURL = (fireval) => {
              let obj = Actions.find((a) => a.signature === fireval.signature);

              if (obj) {
                return obj.url;
              } else {
                return false;
              }
            };

            snapshot.forEach((sub) => {
              if (sub) {
                let val = sub.val();

                arr.push({
                  fbx: false,
                  url: getURL(val),
                  firekey: sub.key,
                  fireval: val,
                });
              }
            });

            arr = arr.map((item) => {
              return new Promise((resolve) => {
                new FBXLoader().load(item.url, (v) => {
                  item.fbx = v;
                  resolve(item);
                });
              });
            });

            Promise.all(arr).then((withFBX) => {
              setActions(withFBX);
            });
          }
        });

        clean.push(cleanup);
      });

      return () => {
        clean.forEach((e) => e());
      };
    }
  }, []);

  return (
    <group>
      {url && sentences.length > 0 && (
        <Suspense fallback={<LoadingAvatar></LoadingAvatar>}>
          <AvatarItem
            holder={holder}
            envMap={envMap}
            url={url}
            sentences={sentences}
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

function AvatarItem({ url, sentences, PlaybackState, envMap }) {
  let o3d = new Object3D();
  o3d.name = "avatar";

  let gltf = useGLTF(`${url}`);
  let avatar = useMemo(() => {
    let cloned = SkeletonUtils.clone(gltf.scene);
    return cloned;
  }, []);

  avatar.rotation.set(0, 0, 0);
  avatar.position.set(0, 0, 0);

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
      {createPortal(<primitive object={avatar}></primitive>, o3d)}
      <primitive position={[0, 0, 0]} object={o3d}></primitive>

      <Decorate avatar={avatar}></Decorate>

      {createPortal(
        <DisplaySentence
          sentences={sentences}
          PlaybackState={PlaybackState}
          envMap={envMap}
        ></DisplaySentence>,
        avatar
      )}

      <ActionsApply
        mixer={mixer}
        PlaybackState={PlaybackState}
        sentences={sentences}
        avatar={avatar}
      ></ActionsApply>
    </group>
  );
}

function ActionsApply({ avatar, mixer, sentences, PlaybackState }) {
  PlaybackState.makeKeyReactive("cursor");

  let action = useMemo(() => {
    let sentence = sentences[PlaybackState.cursor];
    return mixer.clipAction(sentence.fbx.animations[0], avatar);
  }, [PlaybackState.cursor]);

  useEffect(() => {
    action.reset();
    action.repetitions = 1;
    action.clampWhenFinished = true;
    action.play();

    let sentence = sentences[PlaybackState.cursor];
    PlaybackState.actionKey = sentence.firekey;

    let end = () => {
      if (PlaybackState.autoPlayNext) {
        PlaybackState.cursor = PlaybackState.cursor + 1;
      }
    };

    mixer.addEventListener("finished", end);
    return () => {
      mixer.removeEventListener("finished", end);
      action.fadeOut(0.1);
    };
  }, [action]);

  return null;
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
