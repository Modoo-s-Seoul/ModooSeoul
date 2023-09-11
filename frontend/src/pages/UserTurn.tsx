// 유저 턴에 대한 컴포넌트입니다.
import "./UserTurn.css";
import boardData from "../data/BoardData";
import Ground from "../components/Turn/Ground";
import Key from "../components/Turn/Key";
import Oil from "../components/Turn/Oil";
import Prison from "../components/Turn/Prison";
import Start from "../components/Turn/Start";
import Subway from "../components/Turn/Subway";
import Tax from "../components/Turn/Tax";
import { useState } from "react";
import { playerPosition } from "./Board";

interface Props {
  position: playerPosition[];
  turn: number;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  pNum: number;
}

export default function BoardInfo({ position, turn, close, pNum }: Props) {
  const [turnData] = useState(
    boardData[
      `${position[(turn + 3) % pNum].row}-${position[(turn + 3) % pNum].col}`
    ]
  );

  return (
    <>
      {/* Event Board */}
      <div className={"eventContainer"}>
        {turnData.kind === "ground" && (
          <Ground turnData={turnData} close={close} />
        )}
        {turnData.kind === "key" && <Key turnData={turnData} close={close} />}
        {turnData.kind === "start" && (
          <Start turnData={turnData} close={close} />
        )}
        {turnData.kind === "subway" && (
          <Subway turnData={turnData} close={close} />
        )}
        {turnData.kind === "prison" && (
          <Prison turnData={turnData} close={close} />
        )}
        {turnData.kind === "oil" && <Oil turnData={turnData} close={close} />}
        {turnData.kind === "tax" && <Tax turnData={turnData} close={close} />}
      </div>
    </>
  );
}
