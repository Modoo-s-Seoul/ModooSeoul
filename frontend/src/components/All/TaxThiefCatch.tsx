import { useState } from "react";
import "../Base/Modal.css";
import "./TaxThiefCatch.css";
import { useRecoilValue } from "recoil";
import { playerDataState } from "../../data/IngameData";

export default function TaxThiefCatch() {
  /** 세금 도둑창 끄고 켜기 */
  const [isTaxCatchVisible, setIsTaxCatchVisible] = useState(false);
  const toggleTaxCatch = () => {
    setIsTaxCatchVisible(!isTaxCatchVisible);
  };

  return (
    <>
      <div className="taxCatchBtn" onClick={toggleTaxCatch}>
        탈세 신고
      </div>
      {isTaxCatchVisible && <TaxCatchRoom onClose={toggleTaxCatch} />}
    </>
  );
}

/** 토글로 커지는 세금 도둑 잡기 인터페이스 */
interface TaxCatchLoadProps {
  onClose: () => void; //
}
/** 토글로 커지는 세금 도둑 잡기 창 */
function TaxCatchRoom({ onClose }: TaxCatchLoadProps) {
  // 기본 인자
  const playerData = useRecoilValue(playerDataState); //
  const [selectedPlayer, setSelectedPlayer] = useState(6);
  // 리폿버튼 누를시
  const handleReport = () => {
    if (selectedPlayer !== 6) {
      console.log("선택한 플레이어:", selectedPlayer);
    } else if (selectedPlayer == 6) {
      alert("플레이어를 선택하세요.");
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
        <div className="thiefCatchContainer">
          <h1>탈 세 신 고</h1>
          <div className="playerButtons">
            {playerData.map((player, index) => (
              <button
                key={index}
                onClick={() => {
                  if (selectedPlayer == index) {
                    setSelectedPlayer(6);
                  } else {
                    setSelectedPlayer(index);
                  }
                }}
                className={`playerSelectBtn ${
                  selectedPlayer === index ? "selected" : ""
                }`}
              >
                {player.name}
              </button>
            ))}
          </div>
          <button className="reportBtn" onClick={handleReport}>
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}
