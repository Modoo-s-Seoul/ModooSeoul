// import React from 'react';
import "./GroundSelectBtn.css";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  groundMsgNumState,
  isCommonGroundSellActiveState,
  playerInfoState,
  scolState,
  srowState,
} from "../../data/IngameData";
import { useState, useEffect } from "react";
import { boardDataState } from "../../data/BoardData";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";
import { useSocket } from "../../pages/SocketContext";

export default function GroundSelectBtn() {
  // 기본인자
  const [isCommonGroundSellActive, setIsCGSA] = useRecoilState(
    isCommonGroundSellActiveState
  );
  const [groundMsgNum, setGroundMsgNum] = useRecoilState(groundMsgNumState); // 공통턴 선택 순서
  const sRow = useRecoilValue(srowState); // 선택 장소 row
  const sCol = useRecoilValue(scolState); // 선택 장소 col
  // 플레이어 개인정보

  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  // 데이터
  const [boardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData, setTurnData] = useState(boardData[`${sRow}-${sCol}`]); // 선택 장소 데이터

  /** 땅판매 함수 */
  const sellGround = () => {
    console.log(turnData.order);
    // 실제 구현 - 땅 판매
    sendWsMessage(
      socketClient,
      playerInfo.playerId,
      `send/ground-sell`,
      `{"boardIdx":${turnData.order}}`
    );
    // 실제 구현 - 건물 판매
  };

  /** 선택완료시 */
  const toggleSelectGround = () => {
    // 땅 판매
    if (groundMsgNum !== 0) {
      sellGround();
    }

    // 초기화
    setIsCGSA(false);
    setGroundMsgNum(0);
  };

  /** 클릭데이터 반영 */
  useEffect(() => {
    setTurnData(boardData[`${sRow}-${sCol}`]);
  }, [sCol, sRow]);

  return (
    <>
      {isCommonGroundSellActive && (
        <>
          <div className="groundSelectDoneContainer">
            {groundMsgNum == 1 && (
              <div className="groundShowContainer">{turnData.name}</div>
            )}
            <div className="groundSelectText">판매할 땅을 고르세요.</div>
            <div className="groundTimeBar">
              <button
                className="groundSelectDoneBtn"
                onClick={toggleSelectGround}
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
