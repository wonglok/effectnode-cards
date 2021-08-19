import { Text, useBVH } from "@react-three/drei";
import { useRef, useEffect } from "react";
import {
  loginGoogle,
  getFirebase,
  logout,
} from "../../vfx-firebase/firelib.js";
import { User } from "../../vfx-firebase/User.js";

export function LoginBall() {
  User.makeKeyReactive("status");

  let opening = false;
  let onClickLogin = () => {
    if (!opening) {
      opening = true;
      loginGoogle().then(
        ({ user }) => {
          opening = false;

          User.userID = user.uid;
          console.log(user);
        },
        () => {
          opening = false;
        }
      );
    }
  };

  let onClickLogout = () => {
    //
    User.status = "loading";

    logout().then(
      () => {
        User.status = "loggedOut";
      },
      () => {
        User.status = "loggedOut";
      }
    );
  };

  useEffect(() => {
    User.status = "loading";
    return getFirebase()
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          User.status = "loggedIn";
          User.userID = user.uid;
          console.log(user);
        } else {
          User.status = "loggedOut";
          User.userID = false;
        }
      });
  }, []);

  return (
    <group position={[-3, 2, 0]}>
      {User.status === "loading" && (
        <group>
          {/* <Text
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="bottom"
            userData={{ enableBloom: true }}
            outlineWidth={0.001333}
            fontSize={0.5123}
            font={`/font/Cronos-Pro-Light_12448.ttf`}
          >
            Loading...
          </Text> */}
          <mesh
            // ref={ref}
            userData={{
              hint: "Loading...",
            }}
          >
            <torusBufferGeometry
              args={[0.8, 0.1, 100, 25]}
            ></torusBufferGeometry>
            <meshStandardMaterial
              metalness={1}
              roughness={0}
              color="#ffffff"
            ></meshStandardMaterial>
          </mesh>
        </group>
      )}

      {User.status === "loggedIn" && (
        <group>
          {/* <Text
            position={[0, 1, 0]}
            anchorX="center"
            anchorY="bottom"
            userData={{ enableBloom: true }}
            outlineWidth={0.001333}
            fontSize={0.5123}
            font={`/font/Cronos-Pro-Light_12448.ttf`}
          >
            Logout
          </Text> */}
          <mesh
            // ref={ref}

            userData={{
              onClick: onClickLogout,
              hint: "Logout",
            }}
            onClick={onClickLogout}
          >
            <sphereBufferGeometry args={[0.8, 18, 18]}></sphereBufferGeometry>
            <meshStandardMaterial
              metalness={1}
              roughness={0}
              color="#999"
            ></meshStandardMaterial>
          </mesh>
        </group>
      )}

      {User.status === "loggedOut" && (
        <group>
          {/* <Text
            position={[0, 1, 0]}
            anchorX="center"
            anchorY="bottom"
            userData={{ enableBloom: true }}
            outlineWidth={0.001333}
            fontSize={0.5123}
            font={`/font/Cronos-Pro-Light_12448.ttf`}
          >
            Login
          </Text> */}
          <mesh
            // ref={ref}
            userData={{
              onClick: onClickLogin,
              hint: "Login",
            }}
            onClick={onClickLogin}
          >
            <sphereBufferGeometry args={[0.8, 18, 18]}></sphereBufferGeometry>
            <meshStandardMaterial
              metalness={1}
              roughness={0}
              color="#00ffff"
            ></meshStandardMaterial>
          </mesh>
        </group>
      )}
    </group>
  );
}

///

///
