import router from "next/router";
import { useEffect } from "react";
import { getFirebase } from "../vfx-firebase/firelib";

export default function Home() {
  useEffect(() => {
    getFirebase()
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user && user.uid) {
          let snap = await getFirebase()
            .database()
            .ref(`/profiles/${user.uid}`)
            .get();
          let data = snap.val();

          let keys = Object.keys(data.cards || {});

          let latestCardRoom = keys[keys.length - 1];
          if (latestCardRoom) {
            router.push(`/card-room/${latestCardRoom}`);
          } else {
            router.push(`/place/spaceship`);
          }
        } else {
          router.push(`/place/spaceship`);
        }
      });
  }, []);
  return <div></div>;
}
