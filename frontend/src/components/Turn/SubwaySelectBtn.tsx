// import React from 'react';
import "./Subway.css";

import { useRecoilState } from "recoil";
import {
  isSubwayActiveState,
  isSubwayState,
  playerInfoState,
  turnState,
} from "../../data/IngameData";
import { useEffect } from "react";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";

export default function SubwaySelectBtn() {
  // 기본인자
  const [turn] = useRecoilState(turnState);
  const [isSubway, setIsSubway] = useRecoilState(isSubwayState); // 지하철 변동
  const [isSubwayActive, setIsSubwayActive] =
    useRecoilState(isSubwayActiveState); // 지하철 토글(board에서 감지)

  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  /** 선택완료시 */
  const toggleSelectSubway = () => {
    // 이동안할시
    if (isSubway[0].player == null) {
      setIsSubwayActive(false);
      sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
      return;
    }
    // 이동할시
    const newSubwayChange = [...isSubway];
    newSubwayChange[0] = { ...newSubwayChange[0], move: true };
    setIsSubway(newSubwayChange);
    setIsSubwayActive(false);

    // 실제구현 - 지하철이동 위치 업데이트 요청
  };

  /** 시간초과시 */
  useEffect(() => {
    // 플레이어 턴일시
    if (isSubwayActive) {
      const rollTimeout = setTimeout(() => {
        setIsSubwayActive(false);
      }, 10000);
      if (!isSubwayActive) {
        clearTimeout(rollTimeout);
      }
      return () => {
        if (rollTimeout) {
          clearTimeout(rollTimeout);
        }
      };
    }
  }, [turn, isSubwayActive]);

  return (
    <>
      {isSubwayActive && (
        <>
          <div className="subwaySelectDoneContainer">
            <div className="subwaySelectText">이동할 칸을 고르세요</div>
            <div className="subwayTimeBar">
              <button
                className="subwaySelectDoneBtn"
                onClick={toggleSelectSubway}
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
