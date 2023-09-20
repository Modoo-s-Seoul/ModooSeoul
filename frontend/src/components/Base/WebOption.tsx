import { useState } from "react";
import "./Modal.css";
import "./WebOption.css";

export default function WebOption() {
  /** 옵션창 끄고 켜기 */
  const [isWebOptionVisible, setIsWebOptionVisible] = useState(false);
  const toggleWebOption = () => {
    setIsWebOptionVisible(!isWebOptionVisible);
  };

  return (
    <>
      <div className="lobbyHeaderBtn" onClick={toggleWebOption}>
        옵션
      </div>
      {isWebOptionVisible && <WebOptionLoad onClose={toggleWebOption} />}
    </>
  );
}

/** 토글로 커지는 옵션창 인터페이스 */
interface WebOptionLoadProps {
  onClose: () => void; // onClose 함수의 타입을 명시적으로 정의합니다.
}
/** 토글로 커지는 옵션창 */
function WebOptionLoad({ onClose }: WebOptionLoadProps) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalClose">
          <div onClick={onClose} style={{ cursor: "pointer" }}>
            ✖
          </div>
        </div>
        <h1>설정창</h1>
        <div className="optionContainer">
          <div className="optionBox" style={{ cursor: "pointer" }}>
            배경음악 on/off
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
