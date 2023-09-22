// import React from 'react';
import "./NotMyTurn.css";

import { useRecoilValue } from "recoil";
import { pNumState, turnState } from "../../data/IngameData";

/** 본인 턴이 아닐때 보이는 메세지입니다 */
export default function NotMyTurn() {
  const turn = useRecoilValue(turnState); // 현재 플레이 순서
  const pNum = useRecoilValue(pNumState); // 현재 플레이 순서
  // 출력용 플레이어 턴 매칭
  const turnMatch = [];
  for (let i = 0; i < pNum; i++) {
    turnMatch.push(`Player ${i + 1}의 턴입니다`);
  }
  // 출력용 공통턴 매칭
  turnMatch.push("자유 거래시간입니다.");
  // 출력용 뉴스 매칭
  turnMatch.push("원하는 뉴스를 고르세요.");
  return (
    <>
      <div className="notMyTurnContainer">
        <div className="notMyTurnText">{turnMatch[turn]}</div>
      </div>
    </>
  );
}
