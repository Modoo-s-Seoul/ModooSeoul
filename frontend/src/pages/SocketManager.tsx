// SocketManager.tsx
import { ReactNode, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
// import { ipAddress } from "../api/RoomApi";
import { socketAddress } from "../api/RoomApi";
import { CompatClient } from "@stomp/stompjs";
import { SocketContext } from "./SocketContext";

interface Props {
  children: ReactNode;
}

export default function SocketManager({ children }: Props) {
  const [socketClient, setSocketClient] = useState<CompatClient | null>(null);

  useEffect(() => {
    /**웹소켓 통신 클라이언트 생성*/
    const newClient = Stomp.over(new SockJS(`${socketAddress}/ws`));

    // 웹소켓 연결
    newClient.connect({}, () => {
      console.log("웹소켓 연결");
      setSocketClient(newClient);
    });

    return () => {
      if (newClient) {
        newClient.disconnect(() => {
          console.log("웹소켓 연결 닫힘");
        });
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketClient}>
      {children}
    </SocketContext.Provider>
  );
}
