import { Text, PerspectiveCamera } from "@react-three/drei";
import { StarSky } from "../../vfx-metaverse";

export function LoadingScreen() {
  return (
    <group>
      <PerspectiveCamera
        // rotation-x={Math.PI * -0.25}

        position={[0, 0, 25]}
        makeDefault={true}
      ></PerspectiveCamera>

      <Text
        // rotation={[Math.PI * -0.25, 0, 0]}
        position={[0, 0, 10]}
        fontSize={0.3}
        color="white"
        outlineColor={"black"}
        outlineWidth={0.01}
        textAlign={"center"}
      >
        {`Loading...`}
      </Text>

      {/* Optional */}
      <StarSky></StarSky>
    </group>
  );
}
