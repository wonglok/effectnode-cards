import { AdminGate } from "../../vfx-cms/common/AdminGate";
import { logout } from "../../vfx-effectnode/admin/firelib";
export default function Admin() {
  return (
    <AdminGate>
      <div>Admin Page</div>
      <button
        onClick={() => {
          //
          logout().then(() => {
            router.push("/system/login?logout=successful");
          });
        }}
      >
        Logout
      </button>
      <div>Cards Info</div>
    </AdminGate>
  );
}

//

//

//

//
