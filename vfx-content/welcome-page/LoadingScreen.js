import { Text, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function LoadingScreen() {
  let { camera } = useThree();
  return (
    <group>
      <Text
        // rotation={[Math.PI * -0.25, 0, 0]}
        position={[
          camera.position.x,
          camera.position.y,
          camera.position.z + -10,
        ]}
        fontSize={0.3}
        color="white"
        outlineColor={"black"}
        outlineWidth={0.01}
        textAlign={"center"}
      >
        {`Loading Dreams...`}
      </Text>
      {/* <PerspectiveCamera
        position={[0, 0, 10]}
        lookAt={[0, 0, -10]}
      ></PerspectiveCamera> */}
    </group>
  );
}
