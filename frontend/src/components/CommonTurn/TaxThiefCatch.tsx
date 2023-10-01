import { useState } from "react";
import { useRecoilValue } from "recoil";

import "./TaxThiefCatch.css";
import { playerDataState } from "../../data/IngameData";

export default function TaxThiefCatch() {
  const playerData = useRecoilValue(playerDataState);
  // const [selectedPlayer, setSelectedPlayer] = useState(6);
  const [selected, setSelected] = useState(false);

  /**플레이어 신고 */
  const handleReport = () => {
    // if (selectedPlayer !== 6) {
    //   console.log("선택한 플레이어:", selectedPlayer);
    // } else if (selectedPlayer == 6) {
    alert("플레이어를 선택하세요.");
    // }
  };

  return (
    <div className="modalBaseContainer">
      <div className="modalBaseTitle">탈 세 신 고</div>
      <div className="modalBaseBody">
        <div className="taxThiefGrid">
          {playerData.map((player, index) => (
            <div
              key={index}
              className={`modalBaseButton taxThiefButton ${
                selected ? "centered" : ""
              }`}
              style={{
                cursor: `${selected ? "" : "pointer"}`,
              }}
              onClick={() => setSelected(true)}
              // onClick={() => {
              //   if (selectedPlayer == index) {
              //     setSelectedPlayer(6);
              //   } else {
              //     setSelectedPlayer(index);
              //   }
              // }}
            >
              {player.name}
            </div>
          ))}
        </div>
        <div className="reportButtonContainer">
          <div
            className="noticeBox"
            style={{ transform: `${selected ? "scale(0)" : ""}` }}
          >
            탈세자로 의심되는 사람을 고르세요.
          </div>
          <button
            className={`reportButton cancelButton ${
              selected ? "cancelButtonVisible" : ""
            }`}
            style={{
              cursor: "pointer",
            }}
            onClick={() => setSelected(false)}
          >
            다시 고르기
          </button>
          <button
            className={`reportButton glowingButton ${
              selected ? "reportButtonVisible" : ""
            }
            `}
            style={{
              cursor: "pointer",
            }}
            onClick={handleReport}
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}
