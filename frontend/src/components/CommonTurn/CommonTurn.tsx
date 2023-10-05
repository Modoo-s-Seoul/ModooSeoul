// import React from 'react';
import { useEffect, useState } from "react";
import "./CommonTurn.css";
import TaxThiefCatch from "./TaxThiefCatch";
import CloseButton from "../Base/CloseButton";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import {
  roundState,
  isCommonTurnVisibleState,
  turnState,
  isPrisonState,
  pNumState,
  isCommonGroundSellActiveState,
  modalMsgState,
  isModalMsgActiveState,
  matchPosition,
  whoAreYouState,
} from "../../data/IngameData";
import TimeBar from "../Base/TimeBar";
import StockTrade from "./Stock/StockTrade";
import IngameModal from "../Base/IngameModal";
import MessageModal from "../Base/MessageModal";
import { boardDataState } from "../../data/BoardData";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";
import { useSocket } from "../../pages/SocketContext";
import { playerInfoState } from "../../data/IngameData";

export default function CommonTurn() {
  // 기본 인자
  const commonTime = 100000000000;
  const [timeCnt, setTimeCnt] = useState(commonTime);
  const setRound = useSetRecoilState(roundState);
  const [turn, setTurn] = useRecoilState(turnState); // 현재 턴 수
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const setIsCommonTurnVisible = useSetRecoilState(isCommonTurnVisibleState);
  const [isPrison, setIsPrison] = useRecoilState(isPrisonState); // 감옥 여부
  const [isTradeVisible, setIsTradeVisible] = useState(false); // 주식 거래
  const [isTaxCatchVisible, setIsTaxCatchVisible] = useState(false); // 탈세자 신고
  const setIsCGSA = useSetRecoilState(isCommonGroundSellActiveState); // 땅 판매 버튼 열기
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 모달 메세지 토글
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지
  // 플레이어 개인정보
  const whoAreYou = useRecoilValue(whoAreYouState);
  // 데이터 보관
  const matchPos = useRecoilValue(matchPosition); // 매칭데이터
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const socketClient = useSocket();
  const playerInfo = useRecoilValue(playerInfoState); // 플레이어 고유 정보

  /**거래창 열기 */
  const openTrade = () => {
    setIsTradeVisible(true);
  };

  /**거래창 닫기 */
  const closeTrade = () => {
    setIsTradeVisible(false);
  };

  /**탈세자 신고창 열기 */
  const openTaxCatch = () => {
    setIsTaxCatchVisible(true);
  };

  /**탈세자 신고창 닫기 */
  const closeTaxCatch = () => {
    setIsTaxCatchVisible(false);
  };

  /**땅판매 열기 */
  const openGroundSell = () => {
    // 판매 검증
    let canAct = false;
    for (let i = 0; i < matchPos.length; i++) {
      const row = matchPos[i].row;
      const col = matchPos[i].col;
      if (boardData[`${row}-${col}`].player == whoAreYou) {
        // 지을수 있는 땅이 있으면
        canAct = true;
        break;
      }
    }

    if (canAct) {
      // 선택가능한 땅이 있을때
      setIsCGSA(true);
    } else {
      // 선택가능한 땅이 없을때 - 메세지 표기
      setModalMsg("선택가능한 땅이 없습니다.");
      setIsModalMsgActive(true);
    }
  };

  const handleComplete = () => {
    sendWsMessage(socketClient, playerInfo.playerId, `send/action-finish`);
  };

  // 초측정
  useEffect(() => {
    // 턴 수가 공통 턴이 아닐 경우 자동으로 꺼짐(개발용)
    if (turn != pNum) {
      setIsCommonTurnVisible(false);
    }

    const timer = setInterval(() => {
      if (timeCnt > 1) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        // 0초일시 턴 넘기기 (비활성화)
        setIsCommonTurnVisible(false);
        setTurn((prev) => prev + 1);
        setRound((prev) => prev + 1);
        /** 감옥 여부 초기화  */
        // 실제 구현
        // 가구현
        setIsPrison(false);
      }
    }, 1000);
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [turn]);

  useEffect(() => {
    sendWsMessage(
      socketClient,
      playerInfo.gameId,
      "send/timer",
      `{"timerType":"FREE_ACTION"}`
    );
  }, []);

  return (
    <>
      {/* 감옥일시 */}
      {isPrison && (
        <>
          <div className="commonTurnContainer">
            {/* 본문 */}
            <div className={"modalBaseBody"}>
              <div>감옥에서는 아무 행동도 취할 수 없습니다.</div>
            </div>
          </div>
        </>
      )}
      {/* 감옥이 아닐시 */}
      {!isPrison && (
        <div className={`modalBaseContainer`}>
          {/* 상단 바 */}
          <div className="modalBaseTitle">공통 턴</div>
          <MessageModal />

          {/* 본문 */}
          <div className="modalBaseBody">
            <div
              className="modalBaseButton"
              style={{ cursor: "pointer" }}
              onClick={openGroundSell}
            >
              부동산 판매
            </div>
            <div
              className="modalBaseButton"
              onClick={openTrade}
              style={{ cursor: "pointer" }}
            >
              주식 거래
            </div>
            <div
              className="modalBaseButton taxCatchButton"
              onClick={openTaxCatch}
              style={{ cursor: "pointer" }}
            >
              탈세 신고
            </div>
            <button
              className="completeButton"
              style={{
                cursor: "pointer",
              }}
              onClick={handleComplete}
            >
              완료
            </button>
          </div>

          {/* 주식 */}
          <IngameModal visible={isTradeVisible}>
            {isTradeVisible && <StockTrade />}
            <div style={{ cursor: "pointer" }}>
              <CloseButton onClick={closeTrade} />
            </div>
          </IngameModal>

          {/* 탈세자 신고 */}
          <IngameModal visible={isTaxCatchVisible}>
            {isTaxCatchVisible && <TaxThiefCatch />}
            <div style={{ cursor: "pointer" }}>
              <CloseButton onClick={closeTaxCatch} />
            </div>
          </IngameModal>
        </div>
      )}

      {/* TimeBar 렌더링 */}
      <div className="timeBarContainer">
        <TimeBar duration={commonTime} />
      </div>
    </>
  );
}
