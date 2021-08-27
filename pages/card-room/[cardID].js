//
import { Canvas, useThree } from "@react-three/fiber";
import { SimpleBloomer } from "../../vfx-metaverse";
import { sRGBEncoding } from "three";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getFirebase } from "../../vfx-firebase/firelib";
import { Text } from "@react-three/drei";
import router from "next/router";
// import { NPCHelper } from "../../vfx-content/storymaker-page/NPCHelper";
// import { AvatarSlots } from "../../vfx-content/storymaker-page/AvatarSlots";
// import { LoginGate } from "../../vfx-cms/common/LoginGate";

export async function getServerSideProps(context) {
  let cardID = context?.query?.cardID || null;

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
    },
  };
}

export default function StoryPage({ cardID }) {
  return (
    <div className="full">
      <Canvas
        concurrent
        dpr={[1, 3]}
        onCreated={({ gl }) => {
          gl.outputEncoding = sRGBEncoding;
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <SimpleBloomer placeID={cardID}></SimpleBloomer>
        <PageRouter cardID={cardID}></PageRouter>
      </Canvas>
    </div>
  );
}

let Maps = {
  GenesisCard: dynamic(() => import("../../vfx-arc/GenesisCard")),
  spaceship: dynamic(() => import("../../vfx-arc/SpaceStation")),
  movie: dynamic(() => import("../../vfx-arc/MovieScene")),
};

function PageRouter({ cardID }) {
  let { scene } = useThree();
  let [outlet, setCompos] = useState(
    <group>
      <Text>Loading...</Text>
    </group>
  );

  useEffect(async () => {
    let activationInfo = getFirebase()
      .database()
      .ref(`/card-activation-info`)
      .child(cardID);
    let metaRef = getFirebase().database().ref(`/card-meta-info`).child(cardID);
    let metaData = (await metaRef.get()).val();
    let activationData = (await activationInfo.get()).val();

    if (activationData === null) {
      router.push(`/card/${cardID}`);
      return;
    }

    let roomType = metaData.type || "GenesisCard";

    let MyPage = Maps[roomType] || Maps.cyber;
    if (MyPage) {
      setCompos(<MyPage></MyPage>);
    }

    return () => {};
  }, [cardID]);

  return outlet;
}
