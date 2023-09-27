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
  const commonTime = 60;
  const [timeCnt, setTimeCnt] = useState(commonTime);
  const setRound = useSetRecoilState(roundState);
  const setTurn = useSetRecoilState(turnState);
  const setIsCommonTurnVisible = useSetRecoilState(isCommonTurnVisibleState);
  const [isPrison, setIsPrison] = useRecoilState(isPrisonState); // 감옥
  const [isTrade, setIsTrade] = useState(false);

  const openTrade = () => {
    setIsTrade(true);
  };

  const closeTrade = () => {
    setIsTrade(false);
  };

  // 초측정
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCnt > 0) {
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
      <div className="timeBarContainer">
        <TimeBar duration={commonTime} />
      </div>
      {/* 감옥일시 */}
      {isPrison && (
        <>
          <div className="commonTurnContainer">
            {/* 상단 바 */}
            {/* 본문 */}
            <div className={"commonBody"}>
              <div>감옥에서는 아무 행동도 취할 수 없습니다.</div>
            </div>
          </div>
        </>
      )}
      {/* 감옥이 아닐시 */}
      {!isPrison && (
        <div className="commonTurnContainer">
          {/* <TaxThiefCatch /> */}
          {/* 상단 바 */}
          <div className="commonTitle">공통 턴</div>
          {/* 본문 */}
          <div className="commonBody">
            <div className="commonTurnButton" style={{ cursor: "pointer" }}>
              부동산 판매
            </div>
            <div
              className="commonTurnButton"
              onClick={openTrade}
              style={{ cursor: "pointer" }}
            >
              주식 거래
            </div>
            <div className="commonTurnButton" style={{ cursor: "pointer" }}>
              <TaxThiefCatch />
            </div>
          </div>
          {/* 주식 */}
          <IngameModal visible={isTrade}>
            {isTrade && <StockTrade />}
            <div style={{ cursor: "pointer" }}>
              <CloseButton onClick={closeTrade} />
            </div>
          </IngameModal>
        </div>
      )}
    </>
  );
}
