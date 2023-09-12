import { useState } from "react";
import "./Modal.css";

export default function WebInfo() {
  /** 인포창 끄고 켜기 */
  const [isWebInfoVisible, setIsWebInfoVisible] = useState(false);
  const toggleWebInfo = () => {
    setIsWebInfoVisible(!isWebInfoVisible);
  };

  return (
    <>
      <div className="lobbyHeaderBtn" onClick={toggleWebInfo}>
        정보
      </div>
      {isWebInfoVisible && <WebInfoLoad onClose={toggleWebInfo} />}
    </>
  );
}

/** 토글로 커지는 인포창 인터페이스 */
interface WebInfoLoadProps {
  onClose: () => void; // onClose 함수의 타입을 명시적으로 정의합니다.
}
/** 토글로 커지는 인포창 */
function WebInfoLoad({ onClose }: WebInfoLoadProps) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalClose">
          <div onClick={onClose}>✖</div>
        </div>
        <h1>게임 설명</h1>
        <p>모달 내용을 여기에 추가합니다.</p>
      </div>
    </div>
  );
}
