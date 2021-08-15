import { PerspectiveCamera, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useThree, useFrame, createPortal } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { WelcomeAvatar } from "../vfx-content/welcome-page/WelcomeAvatar";
import {
  Map3D,
  UserContorls,
  TailCursor,
  SimpleBloomer,
  StarSky,
  TheHelper,
  useComputeEnvMap,
  AdaptivePixelRatio,
} from "../vfx-metaverse";

export default function Page() {
  return (
    <div className="full">
      <Canvas style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={<LoadingScreen></LoadingScreen>}>
          <Content3D></Content3D>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Content3D() {
  let { get } = useThree();
  let { envMap } = useShaderEnvLight({ imageURL: `/image/sky.png` });
  let gltf = useGLTF(`/map/space-walk-001.glb`);
  // let gltf = useGLTF(`/map/demo-map-000.glb`);

  return (
    <group>
      {gltf.scene && (
        <group>
          <Map3D object={gltf.scene}>
            {({ Now }) => {
              return (
                <group>
                  <UserContorls
                    higherCamera={-0.8}
                    avatarSpeed={0.7}
                    Now={Now}
                  ></UserContorls>
                  <TailCursor Now={Now} color={"#ffffff"}></TailCursor>
                  <TheHelper Now={Now}></TheHelper>
                </group>
              );
            }}
          </Map3D>

          {/* Welcome Avatar */}
          <group
            position={[
              //
              gltf.scene.getObjectByName("welcomeAt").position.x,
              0,
              gltf.scene.getObjectByName("welcomeAt").position.z,
            ]}
          >
            <WelcomeAvatar core={{ envMap }}></WelcomeAvatar>
          </group>
        </group>
      )}

      {/* Simple Bloomder */}
      <SimpleBloomer></SimpleBloomer>

      {/* Optional */}
      <AdaptivePixelRatio></AdaptivePixelRatio>

      {/* Optional */}
      <StarSky></StarSky>
    </group>
  );
}

function useShaderEnvLight({ imageURL, children = () => {} }) {
  let tex = useTexture(imageURL);
  let { get } = useThree();
  let envMap = useComputeEnvMap(
    /* glsl */ `
      const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

      float noise( in vec2 p ) {
        return sin(p.x)*sin(p.y);
      }

      float fbm4( vec2 p ) {
          float f = 0.0;
          f += 0.5000 * noise( p ); p = m * p * 2.02;
          f += 0.2500 * noise( p ); p = m * p * 2.03;
          f += 0.1250 * noise( p ); p = m * p * 2.01;
          f += 0.0625 * noise( p );
          return f / 0.9375;
      }

      float fbm6( vec2 p ) {
          float f = 0.0;
          f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
          f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
          f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
          f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
          f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
          f += 0.015625*(0.5 + 0.5 * noise( p ));
          return f/0.96875;
      }

      float pattern (vec2 p) {
        float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
        return abs(vout);
      }

      uniform sampler2D textureBG;

      vec4 mainImage (vec2 uv) {
        vec4 bg = texture2D(textureBG, uv);

        vec3 rainbow = vec3(
          1.0 - pow(pattern(uv * 2.70123 + -0.17 * cos(time * 0.05)), 1.2),
          1.0 - pow(pattern(uv * 2.70123 +  0.0 * cos(time * 0.05)), 1.2),
          1.0 - pow(pattern(uv * 2.70123 +  0.17 * cos(time * 0.05)), 1.2)
        );

        return vec4(rainbow.xyz, 1.0);
      }
  `.trim(),
    {
      textureBG: { value: tex },
    },
    128
  );

  useEffect(() => {
    let { scene } = get();
    scene.environment = envMap;
    return () => {
      scene.environment = null;
    };
  }, [envMap]);

  return { envMap };
}

function LoadingScreen() {
  return (
    <group>
      <PerspectiveCamera
        position={[0, 5, 5]}
        rotation-x={Math.PI * -0.25}
        makeDefault={true}
      ></PerspectiveCamera>

      <group rotation-x={Math.PI * 0}>
        <gridHelper args={[150, 50, 0x232323, 0xbababa]}></gridHelper>
      </group>

      {/* Optional */}
      <StarSky></StarSky>
    </group>
  );
}
