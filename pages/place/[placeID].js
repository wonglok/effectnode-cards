//
import { Canvas } from "@react-three/fiber";
import { SimpleBloomer } from "../../vfx-metaverse";
import { sRGBEncoding } from "three";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// import { NPCHelper } from "../../vfx-content/storymaker-page/NPCHelper";
// import { AvatarSlots } from "../../vfx-content/storymaker-page/AvatarSlots";
// import { LoginGate } from "../../vfx-cms/common/LoginGate";

export async function getServerSideProps(context) {
  let placeID = context?.query?.placeID || null;

  if (!placeID) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      placeID,
    },
  };
}

export default function StoryPage({ placeID }) {
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
        <SimpleBloomer></SimpleBloomer>
        <PageRouter placeID={placeID}></PageRouter>
      </Canvas>
    </div>
  );
}

let Pages = {
  spaceship: dynamic(() => import("../../vfx-arc/SpaceStation")),
  movie: dynamic(() => import("../../vfx-arc/MovieScene")),
};

function PageRouter({ placeID }) {
  let [outlet, setCompos] = useState(<group></group>);

  useEffect(() => {
    if (Pages[placeID]) {
      let MyPage = Pages[placeID];
      setCompos(<MyPage></MyPage>);
    }

    return () => {
      //
    };
  }, [placeID]);

  return outlet;
}
