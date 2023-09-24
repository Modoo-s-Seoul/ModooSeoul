// import React from 'react';
import { useEffect, useState } from 'react';
import './CommonTurn.css';
import TaxThiefCatch from './TaxThiefCatch';
import CloseBtnCommon from './CloseBtnCommon';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  roundState,
  isCommonTurnVisibleState,
  turnState,
  isPrisonState,
} from '../../data/IngameData';
import ClickBtn from '../Base/CustomButton';
import TimeBar from '../Base/TimeBar';

export default function CommonTurn() {
  // 기본 인자
  const [timeCnt, setTimeCnt] = useState(10);
  const setRound = useSetRecoilState(roundState);
  const setTurn = useSetRecoilState(turnState);
  const setCommonTurn = useSetRecoilState(isCommonTurnVisibleState);
  const [isPrison, setIsPrison] = useRecoilState(isPrisonState); // 감옥

  // 초측정
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCnt > 0) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        // 0초일시 턴 넘기기 (비활성화)
        setCommonTurn(false);
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
            <CloseBtnCommon />
            <div className="commonTimer">{timeCnt}</div>
            <TimeBar duration={60} />
            {/* 본문 */}
            <div className={'commonBody'}>
              <div>감옥에서는 아무 행동도 취할 수 없습니다.</div>
            </div>
          </div>
        </>
      )}
      {/* 감옥이 아닐시 */}
      {!isPrison && (
        <>
          <TaxThiefCatch />
          <div className="commonTurnContainer">
            {/* 상단 바 */}
            <CloseBtnCommon />
            <div className="commonTimer">{timeCnt}</div>
            <TimeBar duration={60} />
            {/* 본문 */}
            <div className={'commonBody'}>
              {/* 주식 */}
              <div className="commonStockGraph">
                <div>주식 그래프</div>
              </div>
              <div className="commonTradingContainer">
                <div className="commonTadingBox">
                  <div>주식 1</div>
                  <div className="twoBtnBox">
                    <div className="stockValueBtn">-</div>
                    <div>{` 갯수 `}</div>
                    <div className="stockValueBtn">+</div>
                  </div>
                </div>
                <div className="commonTadingBox">
                  <div>주식 2</div>
                  <div className="twoBtnBox">
                    <div className="stockValueBtn">-</div>
                    <div>{` 갯수 `}</div>
                    <div className="stockValueBtn">+</div>
                  </div>
                </div>
                <div className="commonTadingBox">
                  <div>주식 3</div>
                  <div className="twoBtnBox">
                    <div className="stockValueBtn">-</div>
                    <div>{` 갯수 `}</div>
                    <div className="stockValueBtn">+</div>
                  </div>
                </div>
              </div>
              <div>예상 보유 자산 : 10억</div>
              <ClickBtn height={40} width={120} text="거래하기" fontsize={24} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
