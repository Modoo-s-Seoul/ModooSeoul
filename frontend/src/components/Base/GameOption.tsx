import { useState } from "react";
import "./Modal.css";
import "./GameOption.css";
import { WebInfoLoad } from "./WebInfo";
import { useNavigate } from "react-router-dom";
import { musicState } from "../../data/CommonData";
import { useRecoilValue } from "recoil";

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
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const toggleWebInfo = () => {
    setIsWebInfoVisible(!isWebInfoVisible);
  };

  // 배경음악 on / off
  const audio = useRecoilValue(musicState);
  const toggleMusic = () => {
    if (audio.paused) {
      audio.play(); // 음악이 꺼져있을 때 켜기
    } else {
      audio.pause(); // 음악이 켜져있을 때 끄기
    }
  };

  /** gameExit */
  const toggleGameExit = () => {
    setIsExitModalVisible(!isExitModalVisible);
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
            <div
              className="optionBox"
              style={{ cursor: "pointer" }}
              onClick={toggleMusic}
            >
              배경음악 on/off
            </div>
            <div
              className="exitBox"
              style={{ cursor: "pointer" }}
              onClick={toggleGameExit}
            >
              게임 나가기
            </div>
            <div></div>
          </div>
        </div>
      </div>
      {isWebInfoVisible && <WebInfoLoad onClose={toggleWebInfo} />}
      {isExitModalVisible && <ExitModal onClose={toggleGameExit} />}
    </>
  );
}

/** 토글로 커지는 옵션창 */
function ExitModal({ onClose }: GameOptionLoadProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="modalOverlay">
        <div className="modal">
          <div className="modalClose">
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              ✖
            </div>
          </div>
          <div>※ 주의 ※</div>
          <div>게임 정보는 저장되지 않습니다. 게임을 종료하시겠습니까?</div>
          <div
            className="exitBox"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate(`/home`);
            }}
          >
            게임 종료
          </div>
        </div>
      </div>
    </>
  );
}
