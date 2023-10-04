// import React from 'react';
// Ws send 함수입니다.

import { CompatClient } from "@stomp/stompjs";
/** 웹소켓 메세지 전송 */
export const sendWsMessage = (
  socketClient: CompatClient | null,
  id: string, // gameId or playerId
  endpoint: string,
  body?: string
) => {
  if (socketClient !== null) {
    socketClient.send(`/${endpoint}/${id}`, {}, body);
  }
};
