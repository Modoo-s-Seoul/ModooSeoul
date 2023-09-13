// 보드판에 있는 칸에 대한 정보입니다.
import "./UserInfo.css";
import { useRecoilValue } from "recoil";
import { playerDataState, turnState } from "../data/IngameData";

export default function UserInfo() {
  const playerData = useRecoilValue(playerDataState); // 플레이어 현재 정보
  const turn = useRecoilValue(turnState); // 현재 플레이 순서
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
