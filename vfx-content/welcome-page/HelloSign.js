import { Text } from "@react-three/drei";
import { createPortal } from "@react-three/fiber";

export function HelloSign({ avatar }) {
  //
  // avatar.traverse((it) => {
  //   if (it.isBone) {
  //     console.log(it.name);
  //   }
  // });
  //

  return (
    <group>
      {createPortal(
        <Text
          position={[0, 0.25, 0]}
          textAlign={"center"}
          anchorX={"center"}
          anchorY={"bottom"}
          maxWidth={2}
          fontSize={0.15}
          font={`/font/Cronos-Pro-Light_12448.ttf`}
          frustumCulled={false}
          color={"black"}
          letterSpacing={0.05}
          userData={{ enableBloom: true }}
          outlineColor="white"
          outlineWidth={0.01}
        >
          Hi
        </Text>,
        avatar.getObjectByName("LeftHand")
      )}
      {createPortal(
        <Text
          position={[0, 0.25, 0]}
          textAlign={"center"}
          anchorX={"center"}
          anchorY={"bottom"}
          maxWidth={2}
          fontSize={0.15}
          font={`/font/Cronos-Pro-Light_12448.ttf`}
          frustumCulled={false}
          color={"black"}
          letterSpacing={0.05}
          userData={{ enableBloom: true }}
          outlineColor="white"
          outlineWidth={0.01}
        >
          Hi
        </Text>,
        avatar.getObjectByName("RightHand")
      )}
    </group>
  );
}
