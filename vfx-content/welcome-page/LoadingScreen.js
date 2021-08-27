import { Text, PerspectiveCamera } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Color } from "three";

export function LoadingScreen() {
  let { camera, scene } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, -10);
    let orig = scene.background;
    scene.background = new Color("black");
    return () => {
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, -10);
      scene.background = orig;
    };
  });

  useFrame(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, -10);
  });

  return (
    <group>
      <Text
        // rotation={[Math.PI * -0.25, 0, 0]}
        position={[0, 0, -10]}
        fontSize={1.0}
        color="white"
        outlineColor={"black"}
        outlineWidth={0.01}
        textAlign={"center"}
        lookAt={camera.position.toArray()}
      >
        {`Loading...`}
      </Text>
    </group>
  );
}
