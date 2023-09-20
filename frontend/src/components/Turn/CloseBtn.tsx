// import React from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import {
  doubleCntState,
  isUserTurnVisibleState,
  pNumState,
  turnState,
} from "../../data/IngameData";

export default function CloseBtn() {
  const [, setIsUserTurnVisible] = useRecoilState(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const pNum = useRecoilValue(pNumState); // 플레이어 턴 수행 가능 여부
  const [turn, setTurn] = useRecoilState(turnState); // 현재 턴
  const doubleCnt = useRecoilValue(doubleCntState);

  return (
    <>
      <button
        onClick={() => {
          if (doubleCnt === 0) {
            setTurn((turn + 1) % (pNum + 1));
          }
          setIsUserTurnVisible(false);
        }}
        className="closeUserTurn"
        style={{ cursor: "pointer" }}
      >
        턴 종료
      </button>
    </>
  );
}
