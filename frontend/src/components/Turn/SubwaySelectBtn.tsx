// import React from 'react';
import "./Subway.css";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  isSubwayActiveState,
  isSubwayState,
  turnState,
} from "../../data/IngameData";
import { useEffect } from "react";

export default function SubwaySelectBtn() {
  // 기본인자
  const turn = useRecoilValue(turnState);
  const [isSubway, setIsSubway] = useRecoilState(isSubwayState); // 지하철 변동
  const [isSubwayActive, setIsSubwayActive] =
    useRecoilState(isSubwayActiveState); // 지하철 토글(board에서 감지)

  /** 선택완료시 */
  const toggleSelectSubway = () => {
    // 이동안할시

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
        // 가구현
        // setTurn(turn + 1);
        // 실제 구현 - 턴 변경 요청
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
