// 보드판에 있는 칸에 대한 정보입니다.
import "./UserInfo.css";
import { useRecoilValue } from "recoil";
import { playerDataState, turnState } from "../data/IngameData";
import { useEffect, useState } from "react";

interface AnimationStates {
  [key: string]: boolean;
}

export default function UserInfo() {
  const playerData = useRecoilValue(playerDataState); // 플레이어 현재 정보
  const turn = useRecoilValue(turnState); // 현재 플레이 순서

  // 각 플레이어의 애니메이션 상태를 저장할 상태 변수
  const [animationStates, setAnimationStates] = useState<AnimationStates>({
    "0": false,
    "1": false,
    "2": false,
    "3": false,
  });

  /** 돈에 변화 감지시 애니메이션 부여 */
  useEffect(() => {
    console.log("Player 1의 돈 바뀜");
    setAnimationStates((prevState) => ({
      ...prevState,
      "0": true,
    }));
  }, [playerData[0][0].money]);

  useEffect(() => {
    console.log("Player 2의 돈 바뀜");
  }, [playerData[0][1].money]);

  useEffect(() => {
    console.log("Player 3의 돈 바뀜");
  }, [playerData[0][2].money]);
  useEffect(() => {
    console.log("Player 4의 돈 바뀜");
  }, [playerData[0][3].money]);

  return (
    <>
      {/* Player Board */}
      <div className="playerContainer">
        {Object.keys(playerData[0]).map((playerIndex) => {
          const player = playerData[0][playerIndex];
          const isAnimating = animationStates[playerIndex];
          return (
            <div
              key={playerIndex}
              className={`playerBox ${
                Number(playerIndex) === turn ? "activePlayer" : ""
              }`}
            >
              <p style={{ color: `#${player.color}`, fontSize: "24px" }}>
                {player.name}
              </p>
              <p className={`${isAnimating ? "animationClass" : ""}`}>
                {player.money}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
