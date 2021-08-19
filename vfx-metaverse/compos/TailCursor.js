import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useMiniEngine } from "../utils/use-mini-engine";
import { CursorTrackerTail } from "../lib/CursorTrackerTail";
import { Color, Object3D } from "three";

export function TailCursor({ Now }) {
  let { mini } = useMiniEngine();

  let { get } = useThree();
  //
  //
  useEffect(() => {
    let mouse = new Object3D();
    mini.onLoop(() => {
      // set cursor pos
      mouse.position.copy(Now.cursorPos);

      // face user
      mouse.lookAt(get().camera.position);
    });

    new CursorTrackerTail({
      mini,
      cursor: mouse,
      mounter: get().scene,
      color: new Color("#ffffff"),
    });
  }, []);

  return null;
}
