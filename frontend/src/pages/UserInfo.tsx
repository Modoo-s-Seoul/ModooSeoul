// 보드판에 있는 칸에 대한 정보입니다.
import "./UserInfo.css";
import { useRecoilValue } from "recoil";
import { playerDataState, turnState } from "../data/IngameData";
import { useEffect } from "react";

export default function UserInfo() {
  const playerData = useRecoilValue(playerDataState); // 플레이어 현재 정보
  const turn = useRecoilValue(turnState); // 현재 플레이 순서

  /** 돈에 변화 감지시 애니메이션 부여 */
  useEffect(() => {
    console.log("0의 돈 바뀜");
  }, [playerData[0].money]);

  return (
    <>
      {/* Player Board */}
      <div className="playerContainer">
        {playerData.map((player, index) => {
          return (
            <div
              key={index}
              className={`playerBox ${
                Number(index) === turn ? "activePlayer" : ""
              }`}
            >
              <p style={{ color: `#${player.color}`, fontSize: "24px" }}>
                {player.name}
              </p>
              <p>{player.money}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
