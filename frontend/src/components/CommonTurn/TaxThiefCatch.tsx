import { useState } from "react";
import { useRecoilValue } from "recoil";

import "./TaxThiefCatch.css";
import { playerDataState } from "../../data/IngameData";

export default function TaxThiefCatch() {
  const playerData = useRecoilValue(playerDataState);
  const [selectedPlayer, setSelectedPlayer] = useState(6);

  /**플레이어 신고 */
  const handleReport = () => {
    if (selectedPlayer !== 6) {
      console.log("선택한 플레이어:", selectedPlayer);
    } else if (selectedPlayer == 6) {
      alert("플레이어를 선택하세요.");
    }
  };

  return (
    <div className="modalBaseContainer">
      <div className="modalBaseTitle">탈 세 신 고</div>
      <div className="modalBaseBody">
        {playerData.map((player, index) => (
          <div
            key={index}
            className="modalBaseButton"
            onClick={() => {
              if (selectedPlayer == index) {
                setSelectedPlayer(6);
              } else {
                setSelectedPlayer(index);
              }
            }}
          >
            {player.name}
          </div>
        ))}
        <button
          className="reportButton"
          style={{ cursor: "pointer" }}
          onClick={handleReport}
        >
          신고하기
        </button>
      </div>
    </div>
  );
}
