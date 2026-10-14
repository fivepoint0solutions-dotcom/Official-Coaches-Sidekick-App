import { useEffect } from "react";
import { startSkins } from "@/lib/hockey-skins";

/** Mounts once: dresses every card, panel, modal and dropdown in a jersey, scoreboard or boards-and-glass design. */
export function HockeySkins() {
  useEffect(() => startSkins(), []);
  return null;
}

export default HockeySkins;
