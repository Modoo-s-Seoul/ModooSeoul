import { useState } from 'react';
import './Modal.css';
import './WebClose.css';

export default function WebClose() {
  /** 옵션창 끄고 켜기 */
  const [isWebCloseVisible, setIsWebCloseVisible] = useState(false);
  const toggleWebClose = () => {
    setIsWebCloseVisible(!isWebCloseVisible);
  };

  return (
    <>
      <div
        className="lobbyHeaderBtn"
        onClick={toggleWebClose}
        style={{ cursor: 'pointer' }}
      >
        나가기
      </div>
      {isWebCloseVisible && <WebCloseLoad onClose={toggleWebClose} />}
    </>
  );
}

/** 토글로 커지는 옵션창 인터페이스 */
interface WebCloseLoadProps {
  onClose: () => void; // onClose 함수의 타입을 명시적으로 정의합니다.
}
/** 토글로 커지는 옵션창 */
function WebCloseLoad({ onClose }: WebCloseLoadProps) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalClose">
          <div onClick={onClose} style={{ cursor: 'pointer' }}>
            ✖
          </div>
        </div>
        <div className="closeContainer">
          <h1>정말 나가시겠습니까?</h1>
          <div
            className="closeBox"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.close();
            }}
          >
            게임 나가기
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
