import { PerspectiveCamera, Text, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { getGPUTier } from "detect-gpu";
import { Suspense, useEffect, useState } from "react";
// import { MeshLambertMaterial, MeshPhongMaterial } from "three";
import { WelcomeAvatar } from "../vfx-content/welcome-page/WelcomeAvatar";
import {
  Map3D,
  UserContorls,
  TailCursor,
  SimpleBloomer,
  StarSky,
  TheHelper,
  useComputeEnvMap,
} from "../vfx-metaverse";

export default function Page() {
  let [ok, setOK] = useState(false);

  return (
    <div className="full">
      <Canvas
        dpr={[1, 3]}
        onCreated={({ gl }) => {
          getGPUTier({ glContext: gl.getContext() }).then((v) => {
            //
            let setDPR = ([a, b]) => {
              let base = window.devicePixelRatio || 1;
              if (b >= base) {
                b = base;
              }

              //
              gl.setPixelRatio(b);

              //
              setOK(true);
            };

            if (v.gpu === "apple a9x gpu") {
              setDPR([1, 1]);
              return;
            }

            if (v.fps <= 30) {
              setDPR([1, 1]);
              return;
            }

            if (v.tier >= 3) {
              setDPR([1, 3]);
            } else if (v.tier >= 2) {
              setDPR([1, 2]);
            } else if (v.tier >= 1) {
              setDPR([1, 1]);
            } else if (v.tier < 1) {
              setDPR([1, 1]);
            }
          });
        }}
        //
        //
        //
        style={{ width: "100%", height: "100%" }}
      >
        {ok ? (
          <Suspense fallback={<LoadingScreen></LoadingScreen>}>
            <Content3D></Content3D>
          </Suspense>
        ) : null}
      </Canvas>
    </div>
  );
}

function Content3D() {
  let { envMap } = useShaderEnvLight({ imageURL: `/image/sky.png` });
  let gltf = useGLTF(`/map/space-walk-001.glb`);

  return (
    <group>
      {/* Optional */}
      {gltf.scene && (
        <group>
          <Map3D object={gltf.scene}>
            {({ Now }) => {
              return (
                <group>
                  <UserContorls
                    higherCamera={-0.6}
                    avatarSpeed={0.9}
                    Now={Now}
                  ></UserContorls>
                  <TailCursor Now={Now} color={"#ffffff"}></TailCursor>
                  <TheHelper Now={Now}></TheHelper>
                </group>
              );
            }}
          </Map3D>
        </group>
      )}

      {/* Avatar */}
      <group
        position={[
          //
          gltf.scene.getObjectByName("welcomeAt").position.x,
          0,
          gltf.scene.getObjectByName("welcomeAt").position.z,
        ]}
      >
        <WelcomeAvatar envMap={envMap}></WelcomeAvatar>
      </group>

      {/* Simple SimpleBloomer */}
      <SimpleBloomer></SimpleBloomer>

      {/* Optional */}
      <StarSky></StarSky>
    </group>
  );
}

function useShaderEnvLight({}) {
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

    vec4 mainImage (vec2 uv, vec3 direction, vec3 pos) {
      return vec4(vec3(
        1.0 - pattern(direction.xy * 1.70123 + -0.17 * cos(time * 0.05)),
        1.0 - pattern(direction.xy * 1.70123 +  0.0 * cos(time * 0.05)),
        1.0 - pattern(direction.xy * 1.70123 +  0.17 * cos(time * 0.05))
      ), 1.0);
    }
  `.trim(),
    {
      // textureBG: { value: tex },
    },
    32
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
        {`Loading you into my dream...\n`}
      </Text>

      {/* Optional */}
      <StarSky></StarSky>
    </group>
  );
}
