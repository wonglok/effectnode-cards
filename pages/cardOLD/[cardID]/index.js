import { Preload, useGLTF, useFBX } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { getGPUTier } from "detect-gpu";
import router, { useRouter } from "next/router";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimationAction, AnimationMixer, Object3D, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { CardContent3D } from "../../../vfx-content/card-page/CardContent3D";
// import {  } from "three";
import { LoadingScreen } from "../../../vfx-content/welcome-page/LoadingScreen";
import { useShaderEnvLight } from "../../../vfx-content/welcome-page/useShaderEnvLight";
import {
  makeShallowStore,
  ShallowStoreMethods,
  StarSky,
  useAutoEvent,
} from "../../../vfx-metaverse";

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

  return {
    props: {
      cardID,
    }, // will be passed to the page component as props
  };
}

//

export default function CardPage({ cardID }) {
  // let { query } = useRouter();

  useEffect(() => {
    let step = "";

    step = `step-verification`;

    if (cardID) {
      router.push(`/card/${cardID}/${step}`);
    }
  }, []);

  return (
    <div></div>
    // <StoryPage cardID={cardID}></StoryPage>
    // <>
    //   {query.cardID && <StoryPage cardID={query.cardID}></StoryPage>}
    //   {query.cardID === "" && <GoHome />}
    //   {typeof query.cardID === "undefined" && <Loading />}
    // </>
  );
}
