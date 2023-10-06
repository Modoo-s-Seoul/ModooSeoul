// 보드판에 있는 칸에 대한 정보입니다.
import "./UserInfo.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  SmallMonenyChangeState,
  displayPlayerDataState,
  first_money,
  pNumState,
  playerDataState,
  // playerDataState,
  turnState,
} from "../data/IngameData";
import { useEffect, useState } from "react";

interface AnimationStates {
  [key: string]: boolean;
}

// 단위 끊어서 표현
function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US");
}

export default function UserInfo() {
  const playerData = useRecoilValue(displayPlayerDataState); // 플레이어 현재 정보
  const turn = useRecoilValue(turnState); // 현재 플레이 순서
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const firstmoney = useRecoilValue(first_money); // 초기 자금 기록
  const [playerRealData] = useRecoilState(playerDataState); // 플레이어 인게임 정보
  const setDisplayPlayerData = useSetRecoilState(displayPlayerDataState); // 출력용 플레이어 인게임 정보
  const [smallMonenyChange, setSmallMoneyChange] = useRecoilState(
    SmallMonenyChangeState
  );

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

  /** 최초 돈 로드 */
  useEffect(() => {
    setDisplayPlayerData(playerRealData);
  }, []);

  /** 돈에 변화 감지시 애니메이션 부여 */
  useEffect(() => {
    // 상승 하락 기록
    if (prevMoneyStates[0] < playerData[0].cash) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "0": true,
      }));
    } else if (prevMoneyStates[0] > playerData[0].cash) {
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
      newPrevMoney[0] = playerData[0].cash;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[0].cash]);

  useEffect(() => {
    // 상승 하락 기록
    if (prevMoneyStates[1] < playerData[1].cash) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "1": true,
      }));
    } else if (prevMoneyStates[1] > playerData[1].cash) {
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
      newPrevMoney[1] = playerData[1].cash;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[1].cash]);

  useEffect(() => {
    // 상승 하락 기록
    if (prevMoneyStates[2] < playerData[2].cash) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "2": true,
      }));
    } else if (prevMoneyStates[2] > playerData[2].cash) {
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
      newPrevMoney[2] = playerData[2].cash;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[2].cash]);

  useEffect(() => {
    // 상승 하락 기록
    if (prevMoneyStates[3] < playerData[3].cash) {
      setIsMoneyIncrease((prevState) => ({
        ...prevState,
        "3": true,
      }));
    } else if (prevMoneyStates[3] > playerData[3].cash) {
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
      newPrevMoney[3] = playerData[3].cash;
      setPrevMoneyStates(newPrevMoney);
    }, 1000);
  }, [playerData[3].cash]);

  /** 월급 흭득 보이기 */
  useEffect(() => {
    // Hide the message after 3 seconds
    setTimeout(() => {
      const newSmallMoneyStatus = [...smallMonenyChange];
      newSmallMoneyStatus[turn] = { player: false };
      setSmallMoneyChange(newSmallMoneyStatus);
    }, 3000); // 3000 milliseconds = 3 seconds
  }, [smallMonenyChange]);

  return (
    <>
      {/* Player Board */}
      <div className="playerContainer">
        {playerData.map((player, index) => {
          // 플레이어 수만큼 생성
          if (pNum > index) {
            return (
              <>
                <div
                  key={index}
                  className={`playerBox ${
                    Number(index) === turn ? "activePlayer" : ""
                  }`}
                >
                  <>
                    <div
                      style={{
                        color: `white`,
                        backgroundColor: `#${player.color}`,
                        fontSize: "40px",
                      }}
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
                        {formatCurrency(player.cash)}원
                        <div className="totalAsset">
                          총자산 : {formatCurrency(player.totalAsset)}원
                        </div>
                      </div>
                    </div>
                  </>
                  {smallMonenyChange[index].player && (
                    <div className="smallMoney">💲 월급 흭득 💲</div>
                  )}
                </div>
              </>
            );
          }
        })}
      </div>
    </>
  );
}
