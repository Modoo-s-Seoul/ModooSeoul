// import React from 'react';
// Ws send 함수입니다.
import { CompatClient } from "@stomp/stompjs";

/** playerId로 요청 */
export const sendPlayerMessage = (
  socketClient: CompatClient | null,
  playerId: string,
  endpoint: string,
  body?: string
) => {
  console.log("Player Send 요청들어옴", `/${endpoint}/${playerId}`);

  if (socketClient !== null) {
    socketClient.send(`/${endpoint}/${playerId}`, {}, body);
  }
};

/** gameId로 요청 */
export function sendGameMessage(
  socketClient: CompatClient,
  gameId: string,
  endpoint: string,
  body?: string
) {
  console.log("Game Send 요청들어옴", `/${endpoint}/${gameId}`);

  if (socketClient !== null) {
    socketClient.send(`/${endpoint}/${gameId}`, {}, body);
  }
}
