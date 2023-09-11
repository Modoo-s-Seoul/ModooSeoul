// 보드판에 있는 칸에 대한 정보입니다.
import "./UserInfo.css";
import { playerInfo } from "./Board";

interface Props {
  playerData: playerInfo[];
  turn: number;
}

export default function UserInfo({ playerData, turn }: Props) {
  return (
    <>
      {/* Player Board */}
      <div className="playerContainer">
        {playerData.map((player, index) => (
          <div
            key={index}
            className={`playerBox ${index === turn ? "activePlayer" : ""}`}
          >
            <p style={{ color: `#${player.color}` }}>{player.name}</p>
            <p>{player.money}</p>
          </div>
        ))}
      </div>
    </>
  );
}
