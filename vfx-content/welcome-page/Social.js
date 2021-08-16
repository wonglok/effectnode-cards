import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function Social() {
  let web = useTexture(`/image/social-icons/web.png`);
  let ig = useTexture(`/image/social-icons/ig.png`);
  let youtube = useTexture(`/image/social-icons/youtube.png`);
  let tiktok = useTexture(`/image/social-icons/tiktok.png`);
  return (
    <group position={[1, 1, 0]}>
      <group position={[0, 0.5, 0]}>
        <Icon map={web}></Icon>
      </group>
      <group position={[0, 0.0, 0]}>
        <Icon map={ig}></Icon>
      </group>

      <group position={[0.5, 0.5, 0]}>
        <Icon map={youtube}></Icon>
      </group>
      <group position={[0.5, 0.0, 0]}>
        <Icon map={tiktok}></Icon>
      </group>
    </group>
  );
}

export function Icon({ map }) {
  let ref = useRef();
  let i = 0;
  useFrame(() => {
    if (ref.current) {
      i += 1 / 60;
      if (i >= 1) {
        i = 1;
      }
      ref.current.scale.setScalar(i);
      let meshLogo = ref.current.children[0];
      if (meshLogo) {
        meshLogo.material.opacity = i;
      }
      let meshPad = ref.current.children[1];
      if (meshPad) {
        meshPad.material.opacity = i * 0.7;
      }
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0.11]}>
        {/*  */}
        {/*  */}
        <planeBufferGeometry args={[0.35, 0.35]}></planeBufferGeometry>
        <meshBasicMaterial map={map} transparent={true}></meshBasicMaterial>
      </mesh>
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <cylinderBufferGeometry
          args={[0.2, 0.2, 0.05, 32, 1]}
        ></cylinderBufferGeometry>
        <meshBasicMaterial color={"#bababa"}></meshBasicMaterial>
      </mesh>
    </group>
  );
}
