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
import { playerPosition } from "../interface/ingame";
import { useRecoilValue } from "recoil";
import { pNumState, turnState } from "../data/IngameData";

interface Props {
  position: playerPosition[];
}

export default function UserTurn({ position }: Props) {
  const turn = useRecoilValue(turnState); // 현재 플레이 순서
  const pNum = useRecoilValue(pNumState); // 전체 플레이어 수
  const boardData = useRecoilValue(boardDataState);

  const [turnData] = useState(
    boardData[
      `${position[(turn + 3) % pNum].row}-${position[(turn + 3) % pNum].col}`
    ]
  );

  return (
    <>
      {/* Event Board */}
      <div className={"eventContainer"}>
        {turnData.kind === "ground" && <Ground turnData={turnData} />}
        {turnData.kind === "key" && <Key turnData={turnData} />}
        {turnData.kind === "start" && <Start turnData={turnData} />}
        {turnData.kind === "subway" && <Subway turnData={turnData} />}
        {turnData.kind === "prison" && <Prison turnData={turnData} />}
        {turnData.kind === "oil" && <Oil turnData={turnData} />}
        {turnData.kind === "tax" && <Tax turnData={turnData} />}
      </div>
    </>
  );
}
