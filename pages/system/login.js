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
  let loginRef = useRef();
  let errRef = useRef();
  let msgRef = useRef();

  useEffect(() => {
    if (window.location.search === "?logout=successful") {
      msgRef.current.innerHTML = "Successfully logged out";
    }
  }, []);

  let tryGoAdminPage = () => {
    testAdminRights().then(
      () => {
        router.push(`/system/admin`);
        console.log("good login");
      },
      () => {
        console.log("bad login");

        errRef.current.innerHTML = "No access rights";
        msgRef.current.innerHTML = "";
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

    ui.start(loginRef.current, {
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
      credentialHelper:
        window.innerWidth <= 1024
          ? firebaseui.auth.CredentialHelper.NONE
          : firebaseui.auth.CredentialHelper.GOOGLE_YOLO,

      callbacks: {
        signInSuccess: function (authResult, redirectUrl) {
          // If a user signed in with email link, ?showPromo=1234 can be obtained from
          // window.location.href.
          // ...

          msgRef.current.innerHTML = "Logging you in to the system";
          tryGoAdminPage();

          return false;
        },
      },
    });

    return () => {};
  }, []);
  return (
    //
    <div className="bg-white font-family-karla h-screen">
      <section className="bg-white font-family-karla h-screen">
        <div className="w-full flex flex-wrap">
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
              <a href="#" className="bg-black text-white font-bold text-xl p-4">
                System Admin Login
              </a>
            </div>

            <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
              <p className="text-center text-3xl">Welcome.</p>

              <div className="block lg:hidden h-24"></div>
              <div ref={loginRef}></div>

              <div className="text-red-500  text-center" ref={errRef}></div>
              <div className="text-yellow-700  text-center" ref={msgRef}></div>

              {/* <form
                className="flex flex-col pt-3 md:pt-8"
                onsubmit="event.preventDefault();"
              >
                <div className="flex flex-col pt-4">
                  <label for="email" className="text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex flex-col pt-4">
                  <label for="password" className="text-lg">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <input
                  type="submit"
                  value="Log In"
                  className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
                />
              </form> */}
              {/* <div className="text-center pt-12 pb-12">
                <p>
                  Don't have an account?{" "}
                  <a href="register.html" className="underline font-semibold">
                    Register here.
                  </a>
                </p>
              </div> */}
            </div>
          </div>

          <div className="w-1/2 shadow-2xl">
            <img
              className="object-cover w-full h-screen hidden md:block"
              src="https://source.unsplash.com/PgkSsx4kKus"
            />
          </div>
        </div>
      </section>

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
