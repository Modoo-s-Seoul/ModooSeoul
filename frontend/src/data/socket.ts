import { atom } from "recoil";
import { CompatClient } from "@stomp/stompjs";

export const socketClient = atom<CompatClient | null>({
  key: "socketClient",
  default: null,
});
