import { useEffect, useState } from "react";
import { testAdminRights } from "../../vfx-effectnode/admin/firelib";

export function AdminGate({ children }) {
  //
  let [ok, setOK] = useState("loading");

  useEffect(() => {
    testAdminRights().then(
      () => {
        setOK("ok");
      },
      () => {
        setOK("fail");
      }
    );
  }, []);
  //
  //
  //

  //
  //
  //
  return (
    <div>
      {ok === "loading" && <div>Checking Rights...</div>}
      {ok === "fail" && <div>No Access Rights...</div>}
      {ok === "ok" && children}
    </div>
  );
}

//

//

//

//
