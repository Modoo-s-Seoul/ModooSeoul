// import React from 'react';
import "./NotMyTurn.css";

import { useRecoilValue } from "recoil";
import { turnState } from "../../data/IngameData";

/** 본인 턴이 아닐때 보이는 메세지입니다 */
export default function NotMyTurn() {
  const turn = useRecoilValue(turnState); // 현재 플레이 순서
  return (
    <>
      <div className="notMyTurnContainer">
        <div className="notMyTurnText">{turn}의 턴입니다.</div>
      </div>
    </>
  );
}
