// 보드판에 있는 칸에 대한 정보입니다.
import "./UserInfo.css";
import { useRecoilValue } from "recoil";
import {
  displayPlayerDataState,
  first_money,
  pNumState,
  // playerDataState,
  turnState,
} from "../data/IngameData";
import { useEffect, useState } from "react";

interface AnimationStates {
  [key: string]: boolean;
}

export default function UserInfo() {
  const playerData = useRecoilValue(displayPlayerDataState); // 플레이어 현재 정보
  const turn = useRecoilValue(turnState); // 현재 플레이 순서
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const firstmoney = useRecoilValue(first_money); // 초기 자금 기록

  // 상승 하락 여부
  const [isMoneyIncrease, setIsMoneyIncrease] = useState<AnimationStates>({
    "0": false,
    "1": false,
    "2": false,
    "3": false,
  });
  // 각 플레이어의 이전 돈 상태를 저장할 상태 변수
  const [prevMoneyStates, setPrevMoneyStates] = useState<number[]>([
    firstmoney,
    firstmoney,
    firstmoney,
    firstmoney,
  ]);

  // 각 플레이어의 애니메이션 상태를 저장할 상태 변수
  const [animationStates, setAnimationStates] = useState<AnimationStates>({
    "0": false,
    "1": false,
    "2": false,
    "3": false,
  });

  /** 돈에 변화 감지시 애니메이션 부여 */
  useEffect(() => {
    console.log("Player 1의 돈 바뀜", prevMoneyStates[0], playerData[0].money);
    // 상승 하락 기록
    if (prevMoneyStates[0] < playerData[0].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "0": true,
      }));
    } else if (prevMoneyStates[0] > playerData[0].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "0": false,
      }));
    }
    // 애니메이션 부여
    setAnimationStates((prevState) => ({
      ...prevState,
      "0": true,
    }));
    setTimeout(() => {
      setAnimationStates((prevState) => ({
        ...prevState,
        "0": false,
      }));
      // 이전 돈 기록 업데이트
      const newPrevMoney = [...prevMoneyStates];
      newPrevMoney[0] = playerData[0].money;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[0].money]);

  useEffect(() => {
    console.log("Player 2의 돈 바뀜");
    // 상승 하락 기록
    if (prevMoneyStates[1] < playerData[1].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "1": true,
      }));
    } else if (prevMoneyStates[1] > playerData[1].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "1": false,
      }));
    }
    setAnimationStates((prevState) => ({
      ...prevState,
      "1": true,
    }));
    setTimeout(() => {
      setAnimationStates((prevState) => ({
        ...prevState,
        "1": false,
      }));
      // 이전 돈 기록 업데이트
      const newPrevMoney = [...prevMoneyStates];
      newPrevMoney[1] = playerData[1].money;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[1].money]);

  useEffect(() => {
    console.log("Player 3의 돈 바뀜");
    // 상승 하락 기록
    if (prevMoneyStates[2] < playerData[2].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "2": true,
      }));
    } else if (prevMoneyStates[2] > playerData[2].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "2": false,
      }));
    }
    setAnimationStates((prevState) => ({
      ...prevState,
      "2": true,
    }));
    setTimeout(() => {
      setAnimationStates((prevState) => ({
        ...prevState,
        "2": false,
      }));
      // 이전 돈 기록 업데이트
      const newPrevMoney = [...prevMoneyStates];
      newPrevMoney[2] = playerData[2].money;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[2].money]);

  useEffect(() => {
    console.log("Player 4의 돈 바뀜");
    // 상승 하락 기록
    if (prevMoneyStates[3] < playerData[3].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "3": true,
      }));
    } else if (prevMoneyStates[3] > playerData[3].money) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "3": false,
      }));
    }
    setAnimationStates((prevState) => ({
      ...prevState,
      "3": true,
    }));
    setTimeout(() => {
      setAnimationStates((prevState) => ({
        ...prevState,
        "3": false,
      }));
      // 이전 돈 기록 업데이트
      const newPrevMoney = [...prevMoneyStates];
      newPrevMoney[3] = playerData[3].money;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[3].money]);

  return (
    <>
      {/* Player Board */}
      <div className="playerContainer">
        {playerData.map((player, index) => {
          // 플레이어 수만큼 생성
          if (pNum > index) {
            return (
              <div
                key={index}
                className={`playerBox ${
                  Number(index) === turn ? "activePlayer" : ""
                }`}
              >
                <div
                  style={{ color: `#${player.color}` }}
                  className="playerName"
                >
                  {player.name}
                </div>
                <div className="playerInnerContainer">
                  <div
                    className={`playerInnerDefault
                  ${animationStates[index] ? "playerMoneyAnimation" : ""} 
                  ${
                    animationStates[index]
                      ? isMoneyIncrease[index]
                        ? "playerMoneyIncrease"
                        : "playerMoneyDecrease"
                      : ""
                  }
                  `}
                  >
                    {player.money}원
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}
