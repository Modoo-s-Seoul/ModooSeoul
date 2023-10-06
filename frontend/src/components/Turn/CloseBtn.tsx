// import React from 'react';
import { useRecoilState } from "recoil";
import {
  isUserTurnVisibleState,
  playerInfoState,
  // pNumState,
  // turnState,
} from "../../data/IngameData";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";

export default function CloseBtn() {
  const [, setIsUserTurnVisible] = useRecoilState(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  // const pNum = useRecoilValue(pNumState); // 플레이어 턴 수행 가능 여부
  // const [turn, setTurn] = useRecoilState(turnState); // 현재 턴

  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  return (
    <>
      <button
        onClick={() => {
          sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
          setIsUserTurnVisible(false);
        }}
        className="closeUserTurn"
        style={{ cursor: "pointer" }}
      >
        턴 종료
      </button>
    </>
  );
}
