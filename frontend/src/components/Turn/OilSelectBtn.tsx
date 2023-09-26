// import React from 'react';
import "./Oil.css";

import { useRecoilState } from "recoil";
import { isOilActiveState, turnState } from "../../data/IngameData";
import { useEffect } from "react";

export default function OilSelectBtn() {
  // 기본인자
  const [turn, setTurn] = useRecoilState(turnState);
  const [isOilActive, setIsOilActive] = useRecoilState(isOilActiveState); // 오일 토글(board에서 감지)

  /** 선택완료시 */
  const toggleSelectOil = () => {
    setIsOilActive(false);
    setTurn(turn + 1);
    // 실제구현 - 오일랜드 위치 업데이트 요청
  };

  /** 시간초과시 */
  useEffect(() => {
    // 플레이어 턴일시
    if (isOilActive) {
      const rollTimeout = setTimeout(() => {
        // 가구현
        // setTurn(turn + 1);
        // 실제 구현 - 턴 변경 요청
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
