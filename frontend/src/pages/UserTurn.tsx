// 유저 턴에 대한 컴포넌트입니다.
import "./UserTurn.css";
import { boardDataState } from "../data/BoardData";
import Ground from "../components/Turn/Ground";
import Key from "../components/Turn/Key";
import Oil from "../components/Turn/Oil";
import Prison from "../components/Turn/Prison";
import Start from "../components/Turn/Start";
import Subway from "../components/Turn/Subway";
import Tax from "../components/Turn/Tax";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isUserTurnVisibleState,
  tcolState,
  trowState,
  turnState,
} from "../data/IngameData";

export default function UserTurn() {
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const [turn, setTurn] = useRecoilState(turnState); // 현재 플레이 순서
  const boardData = useRecoilValue(boardDataState);
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]);
  const [isUserTurnVisible, setIsUserTurnVisible] = useRecoilState(
    isUserTurnVisibleState
  ); // 플레이어 턴 수행 가능 여부

  turn;
  setTurn;
  /** 턴 시간 제한 (작업을 위해 꺼둠) */
  useEffect(() => {
    // const timeoutMap: { [key: string]: number } = {
    //   ground: 10000,
    //   key: 10000,
    //   start: 10000,
    //   subway: 10000,
    //   prison: 10000,
    //   oil: 10000,
    //   tax: 10000,
    // };
    // const timeout = timeoutMap[turnData.kind] || 10000;
    // const timeoutId = setTimeout(() => {
    //   setIsUserTurnVisible(false);
    //   setTurn(turn + 1)
    // }, timeout);
    // return () => clearTimeout(timeoutId);
  }, [turnData.kind, setIsUserTurnVisible]);

  return (
    <>
      {/* Event Board */}
      <div
        className={`eventContainer ${
          isUserTurnVisible ? "userTurnActive" : ""
        }`}
      >
        {turnData.kind === "ground" && <Ground />}
        {turnData.kind === "key" && <Key />}
        {turnData.kind === "start" && <Start />}
        {turnData.kind === "subway" && <Subway />}
        {turnData.kind === "prison" && <Prison />}
        {turnData.kind === "oil" && <Oil />}
        {turnData.kind === "tax" && <Tax />}
      </div>
    </>
  );
}
