// import React from 'react';
import "./Subway.css";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  isSubwayActiveState,
  isSubwayState,
  playerInfoState,
  scolState,
  srowState,
  turnState,
  whoAreYouState,
} from "../../data/IngameData";
import { useEffect, useState } from "react";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";
import { boardDataState } from "../../data/BoardData";

export default function SubwaySelectBtn() {
  // 기본인자
  const [turn] = useRecoilState(turnState);
  const sRow = useRecoilValue(srowState); // 선택 장소 row
  const sCol = useRecoilValue(scolState); // 선택 장소 col
  const [isSubway] = useRecoilState(isSubwayState); // 지하철 변동
  const [isSubwayActive, setIsSubwayActive] =
    useRecoilState(isSubwayActiveState); // 지하철 토글(board에서 감지)
  // 데이터
  const [boardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData, setTurnData] = useState(boardData[`${sRow}-${sCol}`]); // 선택 장소 데이터

  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  // 플레이어 정보
  const whoAreyou = useRecoilValue(whoAreYouState);

  /** 선택완료시 */
  const toggleSelectSubway = () => {
    // 이동안할시
    if (isSubway[0].player == null) {
      setIsSubwayActive(false);
      sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
      return;
    }
    console.log(turnData.order, "로 요청");
    // 실제구현 - 지하철이동 위치 업데이트 요청
    sendWsMessage(socketClient, playerInfo.playerId, "send/check-subway");
    sendWsMessage(
      socketClient,
      playerInfo.playerId,
      "send/subway",
      `{"boardId":${turnData.order}}`
    );
  };

  /** 클릭데이터 반영 */
  useEffect(() => {
    setTurnData(boardData[`${sRow}-${sCol}`]);
    console.log(turnData);
  }, [sCol, sRow]);

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

  // 타이머 관련
  useEffect(() => {
    // 타이머 요청 (본인 턴일때만 요청)
    if (turn == whoAreyou) {
      sendWsMessage(
        socketClient,
        playerInfo.gameId,
        `send/timer`,
        `{"timerType":"SUBWAY"}`
      );
      // 언마운트시 타이머 해제
      return () => {
        sendWsMessage(socketClient, playerInfo.playerId, "send/timer-cancel");
      };
    }
  }, []);

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
