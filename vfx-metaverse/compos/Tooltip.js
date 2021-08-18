import React from "react";
import { createPortal, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export function Tooltip({ Now }) {
  Now.makeKeyReactive("tooltip");
  let { camera } = useThree();
  return createPortal(
    <group position={[0.03, -0.03, -3]}>
      <Text
        anchorX="left"
        anchorY="top"
        userData={{ enableBloom: true }}
        outlineWidth={0.001333}
        fontSize={0.045}
        font={`/font/Cronos-Pro-Light_12448.ttf`}
      >
        {Now.tooltip ? `${Now.tooltip}\n` : ``}
        {Now.hoverData?.website ? `${Now.hoverData?.website}\n` : ""}
        <meshStandardMaterial
          metalness={1.0}
          roughness={0.0}
          userData={{ enableBloom: true }}
        ></meshStandardMaterial>
      </Text>
    </group>,
    camera
  );
}
