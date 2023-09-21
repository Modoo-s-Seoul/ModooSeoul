// import React from 'react';
// Ws send 함수입니다.
import { CompatClient } from "@stomp/stompjs";

/** playerId로 요청 */
export const SendPlayerMessage = (
  socketClient: CompatClient,
  playerId: string,
  endpoint: string
) => {
  console.log("Player Send 요청들어옴", `/${endpoint}/${playerId}`);

  if (socketClient !== null) {
    socketClient.send(`/${endpoint}/${playerId}`);
  }
};

/** gameId로 요청 */
export function SendGameMessage(
  socketClient: CompatClient,
  gameId: string,
  endpoint: string
) {
  console.log("Game Send 요청들어옴", `/${endpoint}/${gameId}`);

  if (socketClient !== null) {
    socketClient.send(`/${endpoint}/${gameId}`);
  }
}
