import { createPortal } from "@react-three/fiber";
import { Object3D } from "three";

// /**
//  * @typedef {Object} RefType
//  * @property {Object} current
//  * @property {() => void} current.methodOne
//  * @property {() => void} current.methodTwo
//  */

/**
 * Form for user login
 * @param {object} props Component props
 * @param {Object3D} props.map Map Object3D
 * @param {function} props.onReady Form submit callback function
 */
export function AvatarSlots({ map }) {
  map.traverse((it) => {
    console.log(it.name, it.userData);
  });
  // //

  return (
    <group>
      {/*  */}
      {/*  */}
      {/*  */}
      {createPortal(
        <group>
          <mesh position={[0, 0.1, 0.2]}>
            <sphereBufferGeometry args={[1, 23, 23]}></sphereBufferGeometry>
            <meshStandardMaterial metalness={1}></meshStandardMaterial>
          </mesh>
        </group>,
        map.getObjectByName(`avatar-honey001`)
      )}
    </group>
  );
}
