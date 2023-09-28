// import React from 'react';
import { useEffect, useState } from "react";
import "./CommonTurn.css";
import TaxThiefCatch from "./TaxThiefCatch";
import CloseButton from "../Base/CloseButton";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  roundState,
  isCommonTurnVisibleState,
  turnState,
  isPrisonState,
} from "../../data/IngameData";
import TimeBar from "../Base/TimeBar";
import StockTrade from "./Stock/StockTrade";
import IngameModal from "../Base/IngameModal";

export default function CommonTurn() {
  // 기본 인자
  const commonTime = 100000000000;
  const [timeCnt, setTimeCnt] = useState(commonTime);
  const setRound = useSetRecoilState(roundState);
  const setTurn = useSetRecoilState(turnState);
  const setIsCommonTurnVisible = useSetRecoilState(isCommonTurnVisibleState);
  const [isPrison, setIsPrison] = useRecoilState(isPrisonState); // 감옥 여부
  const [isTradeVisible, setIsTradeVisible] = useState(false); // 주식 거래
  const [isTaxCatchVisible, setIsTaxCatchVisible] = useState(false); // 탈세자 신고

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

  // 초측정
  useEffect(() => {
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
  }, [timeCnt]);

  return (
    <>
      {/* 감옥일시 */}
      {isPrison && (
        <>
          <div className="commonTurnContainer">
            {/* 상단 바 */}
            {/* 본문 */}
            <div className={"modalBaseBody"}>
              <div>감옥에서는 아무 행동도 취할 수 없습니다.</div>
            </div>
          </div>
        </>
      )}
      {/* 감옥이 아닐시 */}
      {!isPrison && (
        <div className="modalBaseContainer">
          {/* <TaxThiefCatch /> */}
          {/* 상단 바 */}
          <div className="modalBaseTitle">공통 턴</div>

          {/* 본문 */}
          <div className="modalBaseBody">
            <div className="modalBaseButton" style={{ cursor: "pointer" }}>
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
