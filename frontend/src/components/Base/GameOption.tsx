import { useState } from "react";
import "./Modal.css";
import "./GameOption.css";
import { WebInfoLoad } from "./WebInfo";

export default function GameOption() {
  /** 옵션창 끄고 켜기 */
  const [isGameOptionVisible, setIsGameOptionVisible] = useState(false);
  const toggleGameOption = () => {
    console.log("게임옵션");
    setIsGameOptionVisible(!isGameOptionVisible);
  };

  return (
    <>
      <div className="GameOptionBtnContainer" style={{ cursor: "pointer" }}>
        <div className="GameOptionBtn" onClick={toggleGameOption}>
          옵션
        </div>
      </div>

      {isGameOptionVisible && (
        <div className="GameOptionContainer">
          <GameOptionLoad onClose={toggleGameOption} />
        </div>
      )}
    </>
  );
}

/** 토글로 커지는 옵션창 인터페이스 */
interface GameOptionLoadProps {
  onClose: () => void; // onClose 함수의 타입을 명시적으로 정의합니다.
}
/** 토글로 커지는 옵션창 */
function GameOptionLoad({ onClose }: GameOptionLoadProps) {
  /** 인포창 끄고 켜기 */
  const [isWebInfoVisible, setIsWebInfoVisible] = useState(false);
  const toggleWebInfo = () => {
    setIsWebInfoVisible(!isWebInfoVisible);
  };

  return (
    <>
      <div className="modalOverlay">
        <div className="modal">
          <div className="modalClose">
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              ✖
            </div>
          </div>
          <h1>설정창</h1>
          <div className="optionContainer">
            <div
              className="explainBox"
              style={{ cursor: "pointer" }}
              onClick={toggleWebInfo}
            >
              게임 설명
            </div>
            <div className="optionBox" style={{ cursor: "pointer" }}>
              배경음악 on/off
            </div>
            <div className="exitBox" style={{ cursor: "pointer" }}>
              게임 나가기
            </div>
            <div></div>
          </div>
        </div>
      </div>
      {isWebInfoVisible && <WebInfoLoad onClose={toggleWebInfo} />}
    </>
  );
}
