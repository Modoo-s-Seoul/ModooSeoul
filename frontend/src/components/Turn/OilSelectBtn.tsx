// import React from 'react';
import "./Oil.css";

import { useRecoilState } from "recoil";
import {
  isOilActiveState,
  playerInfoState,
  turnState,
} from "../../data/IngameData";
import { useEffect } from "react";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";

export default function OilSelectBtn() {
  // 기본인자
  const [turn] = useRecoilState(turnState);
  const [isOilActive, setIsOilActive] = useRecoilState(isOilActiveState); // 오일 토글(board에서 감지)

  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  /** 선택완료시 */
  const toggleSelectOil = () => {
    setIsOilActive(false);
    // 실제구현 - 오일랜드 위치 업데이트 요청
    sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
  };

  /** 시간초과시 */
  useEffect(() => {
    // 플레이어 턴일시
    if (isOilActive) {
      const rollTimeout = setTimeout(() => {
        setIsOilActive(false);
      }, 10000);
      if (!isOilActive) {
        clearTimeout(rollTimeout);
      }
      return () => {
        if (rollTimeout) {
          clearTimeout(rollTimeout);
        }
      };
    }
  }, [turn, isOilActive]);

  return (
    <>
      {isOilActive && (
        <>
          <div className="oilSelectDoneContainer">
            <div className="oilSelectText">적용할 칸을 고르세요</div>
            <div className="oilTimeBar">
              <button
                className="oilSelectDoneBtn"
                onClick={toggleSelectOil}
                style={{ cursor: "pointer" }}
              >
                선택 완료
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
