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
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { tcolState, trowState } from "../data/IngameData";

export default function UserTurn() {
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col

  const boardData = useRecoilValue(boardDataState);
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]);

  return (
    <>
      {/* Event Board */}
      {turnData.kind === "ground" && <Ground />}
      {turnData.kind === "key" && <Key />}
      {turnData.kind === "start" && <Start />}
      {turnData.kind === "subway" && <Subway />}
      {turnData.kind === "prison" && <Prison />}
      {turnData.kind === "oil" && <Oil />}
      {turnData.kind === "tax" && <Tax />}
    </>
  );
}
