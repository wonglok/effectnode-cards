import {
  getFirebase,
  getMe,
  getUI,
  loginGoogle,
  testAdminRights,
} from "../../vfx-effectnode/admin/firelib";
import router from "next/router";
import { useEffect, useRef } from "react";
import "firebaseui/dist/firebaseui.css";

export default function System() {
  let ref = useRef();
  let errRef = useRef();

  let tryGoAdminPage = () => {
    testAdminRights().then(
      () => {
        router.push(`/system/admin`);
        console.log("good login");
      },
      () => {
        console.log("bad login");

        errRef.current.innerHTML = "no access rights";
      }
    );
  };

  //
  useEffect(() => {
    let firebase = getFirebase();
    var firebaseui = require("firebaseui");

    /** @type firebaseui.auth.AuthUI */
    let ui = getUI();

    ui.disableAutoSignIn();

    ui.start(ref.current, {
      signInOptions: [
        {
          // Google provider must be enabled in Firebase Console to support one-tap
          // sign-up.
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable ID token credentials for this provider.
          // This can be obtained from the Credentials page of the Google APIs
          // console. Use the same OAuth client ID used for the Google provider
          // configured with GCIP or Firebase Auth.
          clientId:
            "612670919698-l2v5mgco7g7vp2ca9slgm90hv2mnb7sr.apps.googleusercontent.com",
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      //
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,

      callbacks: {
        signInSuccess: function (authResult, redirectUrl) {
          // If a user signed in with email link, ?showPromo=1234 can be obtained from
          // window.location.href.
          // ...

          console.log("login ok", 123);
          tryGoAdminPage();

          return false;
        },
      },
    });

    return () => {};
  }, []);

  return (
    <div>
      <div className="text-red-500" ref={errRef}></div>
      <div ref={ref}></div>
      <div>
        {typeof window !== "undefined" &&
        window.location.search === "?logout=successful"
          ? "Successfully logged out."
          : ""}
      </div>

      <button
        onClick={() => {
          loginGoogle().then(() => {
            //

            tryGoAdminPage();
          });
        }}
      >
        Login with Google
      </button>
    </div>
  );
}

//
//
//
//
//
//
