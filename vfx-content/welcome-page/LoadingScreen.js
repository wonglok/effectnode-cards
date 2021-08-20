import { Text, PerspectiveCamera } from "@react-three/drei";
import { createPortal, useThree } from "@react-three/fiber";
import { StarSky } from "../../vfx-metaverse";

export function LoadingScreen() {
  let { get } = useThree();

  return (
    <group>
      {createPortal(
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
        </Text>,
        get().camera
      )}

      {/* Optional */}
      <StarSky></StarSky>
    </group>
  );
}
