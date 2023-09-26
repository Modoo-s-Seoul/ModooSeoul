import { createContext, useContext } from "react";
import { CompatClient } from "@stomp/stompjs";

/**소켓 컨텍스트 */
export const SocketContext = createContext<CompatClient | null>(null);
/**웹소켓 클라이언트 객체 할당*/
export const useSocket = () => useContext(SocketContext);
