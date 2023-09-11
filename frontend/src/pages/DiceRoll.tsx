import React, { useEffect, useState } from "react";
import "./DiceRoll.css"; // CSS 파일을 import 해야 합니다.

interface Props {
  diceActive: boolean;
  dice1: number;
  dice2: number;
}

function DiceRoll({ diceActive, dice1, dice2 }: Props) {
  const [diceOneClass, setDiceOneClass] = useState("");
  const [diceTwoClass, setDiceTwoClass] = useState("");
  // 실제 주사위 값 설정
  const rollDice = () => {
    const diceOne = dice1;
    const diceTwo = dice2;
    console.log(diceOne + " " + diceTwo);
    setDiceOneClass("show-" + diceOne);
    setDiceTwoClass("show-" + diceTwo);
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
      console.log("DiceActive");
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
    <div className="diceContainer">
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
      {/* <div id="roll" className="roll-button">
        <button className="diceRollBtn" onClick={rollDice}>
          주사위 굴리기
        </button>
      </div> */}
    </div>
  );
}

export default DiceRoll;
