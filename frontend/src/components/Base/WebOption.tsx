import { useState } from "react";
import "./Modal.css";
import "./WebOption.css";
import { musicState } from "../../data/CommonData";
import { useRecoilValue } from "recoil";

export default function WebOption() {
  /** 옵션창 끄고 켜기 */
  const [isWebOptionVisible, setIsWebOptionVisible] = useState(false);
  const toggleWebOption = () => {
    setIsWebOptionVisible(!isWebOptionVisible);
  };

  return (
    <>
      <div
        className="lobbyHeaderBtn"
        onClick={toggleWebOption}
        style={{ cursor: "pointer" }}
      >
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
  // 배경음악 on / off
  const audio = useRecoilValue(musicState);
  const toggleMusic = () => {
    if (audio.paused) {
      audio.play(); // 음악이 꺼져있을 때 켜기
    } else {
      audio.pause(); // 음악이 켜져있을 때 끄기
    }
  };
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalClose">
          <div onClick={onClose} style={{ cursor: "pointer" }}>
            ✖
          </div>
        </div>
        <h1>옵션</h1>
        <div className="optionContainer">
          <div
            className="optionBox"
            style={{ cursor: "pointer" }}
            onClick={toggleMusic}
          >
            배경음악 on/off
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
