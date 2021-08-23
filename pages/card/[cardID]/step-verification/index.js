import { Preload, useGLTF, useFBX } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { getGPUTier } from "detect-gpu";
import { useRouter } from "next/router";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimationAction, AnimationMixer, Object3D, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { CardVerification } from "../../../../vfx-content/card-is-valid-page/CardVerification";
// import {  } from "three";
import { LoadingScreen } from "../../../../vfx-content/welcome-page/LoadingScreen";
import { useShaderEnvLight } from "../../../../vfx-content/welcome-page/useShaderEnvLight";
import {
  makeShallowStore,
  ShallowStoreMethods,
  StarSky,
  useAutoEvent,
} from "../../../../vfx-metaverse";

//
//
export async function getServerSideProps(context) {
  let cardID = context.query?.cardID || null;
  if (!cardID) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //
  return {
    props: {
      cardID,
    }, // will be passed to the page component as props
  };
}

//

export default function CardPage({ cardID }) {
  console.log(cardID);
  // let { query } = useRouter();

  return (
    <StoryPage cardID={cardID}></StoryPage>
    // <>
    //   {query.cardID && <StoryPage cardID={query.cardID}></StoryPage>}
    //   {query.cardID === "" && <GoHome />}
    //   {typeof query.cardID === "undefined" && <Loading />}
    // </>
  );
}

function StoryPage({ cardID }) {
  let [wait, setOK] = useState(false);

  //

  return (
    <div className="full">
      <Canvas
        concurrent
        dpr={[1, 3]}
        onCreated={({ gl }) => {
          gl.physicallyCorrectLights = true;
          getGPUTier({ glContext: gl.getContext() }).then((v) => {
            let setDPR = ([a, b]) => {
              let base = window.devicePixelRatio || 1;
              if (b >= base) {
                b = base;
              }

              gl.setPixelRatio(b);

              setOK(true);
            };

            if (v.gpu === "apple a9x gpu") {
              setDPR([1, 1]);
              return;
            } else if (v.fps <= 30) {
              setDPR([1, 1]);
            } else if (v.tier >= 3) {
              setDPR([1, 3]);
            } else if (v.tier >= 2) {
              setDPR([1, 2]);
            } else if (v.tier >= 1) {
              setDPR([1, 1]);
            } else if (v.tier < 1) {
              setDPR([1, 1]);
            }
          });
        }}
        //
        //
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={<LoadingScreen></LoadingScreen>}>
          {wait && (
            <group>
              <CardVerification cardID={cardID}></CardVerification>
              <Preload all></Preload>
            </group>
          )}
        </Suspense>
        <StarSky></StarSky>
      </Canvas>
    </div>
  );
}
