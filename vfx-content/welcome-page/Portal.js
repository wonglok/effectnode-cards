export function Portal({ avatar }) {
  return (
    <group>
      <mesh position={[0, 1.5, 0]}>
        <sphereBufferGeometry args={[2.5, 35, 35]}></sphereBufferGeometry>
        <meshStandardMaterial
          color={"#777777"}
          userData={{ enableBloom: true }}
          metalness={1}
          roughness={0.0}
        ></meshStandardMaterial>
      </mesh>
    </group>
  );
}
