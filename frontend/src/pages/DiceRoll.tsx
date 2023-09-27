import { useEffect, useState } from "react";
import "./DiceRoll.css"; // CSS 파일을 import 해야 합니다.
import { useRecoilValue } from "recoil";
import {
  dice1State,
  dice2State,
  diceActiveState,
  isCommonTurnVisibleState,
  isLoadingVisibleState,
  isNewsVisibleState,
  isOilActiveState,
  isPlayerMoveState,
  isRollingState,
  isStartActiveState,
  isSubwayActiveState,
  isUserTurnVisibleState,
} from "../data/IngameData";
interface diceRollProps {
  rollDiceInBoard: () => void;
}
export default function DiceRoll({ rollDiceInBoard }: diceRollProps) {
  // 기본 인자
  const diceone = useRecoilValue(dice1State);
  const dicetwo = useRecoilValue(dice2State);
  const isRolling = useRecoilValue(isRollingState);
  const diceActive = useRecoilValue(diceActiveState);
  const isPlayerMove = useRecoilValue(isPlayerMoveState);
  const [diceOneClass, setDiceOneClass] = useState("");
  const [diceTwoClass, setDiceTwoClass] = useState("");
  const isUserTurnVisible = useRecoilValue(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const isCommonTurnVisible = useRecoilValue(isCommonTurnVisibleState); // 공통 턴 수행 가능 여부
  const loadingVisible = useRecoilValue(isLoadingVisibleState); // 로딩 페이지 토글
  const isOilActive = useRecoilValue(isOilActiveState); // 오일 토글
  const isNewsVisible = useRecoilValue(isNewsVisibleState); // 뉴스 턴 여부
  const isSubwayActive = useRecoilValue(isSubwayActiveState); // 지하철 턴 여부
  const isStartActive = useRecoilValue(isStartActiveState); // 시작점 턴 여부

  // 실제 주사위 값 설정
  const rollDice = () => {
    console.log("주사위 값은 ", diceone + " " + dicetwo);
    setDiceOneClass("show-" + diceone);
    setDiceTwoClass("show-" + dicetwo);
  };

  // 주사위 1,1 로 초기화
  const rollDiceReset = () => {
    setDiceOneClass("show-" + 1);
    setDiceTwoClass("show-" + 1);
  };

  // 주사위 4,4로 한번 돌리기
  const rollDiceReset2 = () => {
    setDiceOneClass("show-" + 4);
    setDiceTwoClass("show-" + 4);
  };

  useEffect(() => {
    if (diceActive === true) {
      rollDiceReset();
      setTimeout(() => {
        rollDiceReset2();
      }, 300);
      setTimeout(() => {
        rollDice();
      }, 700);
    }
  }, [diceActive]);

  return (
    <>
      {!loadingVisible &&
        !isPlayerMove &&
        !isUserTurnVisible &&
        !isStartActive &&
        !isCommonTurnVisible &&
        !isOilActive &&
        !isNewsVisible &&
        !isSubwayActive && (
          <div className="diceContainer">
            <div className="diceContainer">
              <div className="msgContainer">
                {isRolling && diceone == dicetwo && (
                  <div className="doubleMsg">더블</div>
                )}
                {isRolling && <div className="sumMsg">{diceone + dicetwo}</div>}
              </div>
              <div className="flexContainer">
                <div className="container">
                  <div id="dice1" className={`dice dice-one ${diceOneClass}`}>
                    <div id="dice-one-side-one" className="side one">
                      <div className="dot one-1"></div>
                    </div>
                    <div id="dice-one-side-two" className="side two">
                      <div className="dot two-1"></div>
                      <div className="dot two-2"></div>
                    </div>
                    <div id="dice-one-side-three" className="side three">
                      <div className="dot three-1"></div>
                      <div className="dot three-2"></div>
                      <div className="dot three-3"></div>
                    </div>
                    <div id="dice-one-side-four" className="side four">
                      <div className="dot four-1"></div>
                      <div className="dot four-2"></div>
                      <div className="dot four-3"></div>
                      <div className="dot four-4"></div>
                    </div>
                    <div id="dice-one-side-five" className="side five">
                      <div className="dot five-1"></div>
                      <div className="dot five-2"></div>
                      <div className="dot five-3"></div>
                      <div className="dot five-4"></div>
                      <div className="dot five-5"></div>
                    </div>
                    <div id="dice-one-side-six" className="side six">
                      <div className="dot six-1"></div>
                      <div className="dot six-2"></div>
                      <div className="dot six-3"></div>
                      <div className="dot six-4"></div>
                      <div className="dot six-5"></div>
                      <div className="dot six-6"></div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div id="dice2" className={`dice dice-two ${diceTwoClass}`}>
                    <div id="dice-two-side-one" className="side one">
                      <div className="dot one-1"></div>
                    </div>
                    <div id="dice-two-side-two" className="side two">
                      <div className="dot two-1"></div>
                      <div className="dot two-2"></div>
                    </div>
                    <div id="dice-two-side-three" className="side three">
                      <div className="dot three-1"></div>
                      <div className="dot three-2"></div>
                      <div className="dot three-3"></div>
                    </div>
                    <div id="dice-two-side-four" className="side four">
                      <div className="dot four-1"></div>
                      <div className="dot four-2"></div>
                      <div className="dot four-3"></div>
                      <div className="dot four-4"></div>
                    </div>
                    <div id="dice-two-side-five" className="side five">
                      <div className="dot five-1"></div>
                      <div className="dot five-2"></div>
                      <div className="dot five-3"></div>
                      <div className="dot five-4"></div>
                      <div className="dot five-5"></div>
                    </div>
                    <div id="dice-two-side-six" className="side six">
                      <div className="dot six-1"></div>
                      <div className="dot six-2"></div>
                      <div className="dot six-3"></div>
                      <div className="dot six-4"></div>
                      <div className="dot six-5"></div>
                      <div className="dot six-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!isRolling && (
              <div className="diceTimeBar">
                <button
                  id="move-button"
                  className={`rollDiceBtn `}
                  onClick={rollDiceInBoard}
                  style={{ cursor: "pointer" }}
                >
                  주사위 굴리기
                </button>
              </div>
            )}
          </div>
        )}
    </>
  );
}
