import { useState } from 'react';
import './Modal.css';
import './WebInfo.css';

export default function WebInfo() {
  /** 인포창 끄고 켜기 */
  const [isWebInfoVisible, setIsWebInfoVisible] = useState(false);
  const toggleWebInfo = () => {
    setIsWebInfoVisible(!isWebInfoVisible);
  };

  return (
    <>
      <div
        className="lobbyHeaderBtn"
        onClick={toggleWebInfo}
        style={{ cursor: 'pointer' }}
      >
        게임설명
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
export function WebInfoLoad({ onClose }: WebInfoLoadProps) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalClose">
          <div style={{ cursor: 'pointer' }} onClick={onClose}>
            ✖
          </div>
        </div>
        <h1>"모두의 서울" 게임설명</h1>
        <div className="infoContainer">
          <div className="infoBox">
            <div className="infoSubTitle">서울을 기반으로 한 부루마블</div>
            <img src="/assets/rule1.png" alt="" />
            <div className="infoTxt">
              <div className="infoRuleTitle">부루마블 게임 (2~4인)</div>
              <div>
                "모두의 서울"은 서울을 기반으로한 전략보드 게임입니다.
              </div>{' '}
              <div>주사위를 굴려 땅을 이동해 부동산 자산을 늘리고</div>
              <div>매 라운드 주식을 통해 자본금을 늘려가보세요!</div>
              <p></p>
              <p></p>
            </div>
          </div>
          <div className="infoBox">
            <div className="infoSubTitle">뉴스를 확인하고 주식시장을 예측</div>
            <img src="/assets/rule2.png" alt="" />
            <div className="infoTxt">
              <div className="infoRuleTitle">모두의 서울만의 특별한 규칙 1</div>
              <div>라운드가 시작마다 주어지는 뉴스를 통해</div>
              <div>주식시장의 변동을 예측해보세요.</div>
              <div>주식시장은 라운드가 끝날때 열리니</div>
              <div>자본금을 잘 분배해서 턴을 결정해야겠죠?</div>
            </div>
          </div>
          <div className="infoBox">
            <div className="infoSubTitle">납세는 필수! 탈세범을 잡아라</div>
            <img src="/assets/rule3.png" alt="" />
            <div className="infoTxt">
              <div className="infoRuleTitle">모두의 서울만의 특별한 규칙 2</div>
              <div>모두의 서울에는 경제 활동에 대한 세금이 발생합니다.</div>
              <div>세금을 납부하지 않는 플레이어들도 있을텐데요</div>
              <div>라운드가 끝날때마다 탈세범을 지목할 수 있습니다.</div>
              <div>천인공노할 탈세범을 잡아 혼내주시기 바랍니다.</div>
              <div>물론 잘못된 지목에는 대가가 따르겠죠?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
