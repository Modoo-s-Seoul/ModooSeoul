import { useState } from "react";
import { useRecoilValue } from "recoil";

import "./TaxThiefCatch.css";
import { playerDataState, playerInfoState } from "../../data/IngameData";
import { sendPlayerMessage } from "../IngameWs/IngameSendFunction";
import { useSocket } from "../../pages/SocketContext";

export default function TaxThiefCatch() {
  const socketClient = useSocket();
  const playerInfo = useRecoilValue(playerInfoState);
  const playerData = useRecoilValue(playerDataState);
  const [selected, setSelected] = useState(false);
  const [reported, setReported] = useState(false);
  const [taxThief, setTaxThief] = useState("");
  const [taxThiefColor, setTaxThiefColor] = useState("");

  /** 플레이어 선택 */
  const selectPlayer = (playerName: string, playerColor: string) => {
    setSelected(true);
    setTaxThief(playerName);
    setTaxThiefColor(playerColor);
  };

  /** 다시 고르기 */
  const chooseAgain = () => {
    setSelected(false);
    setTaxThief("");
    setTaxThiefColor("");
  };

  /** 플레이어 신고 */
  const handleReport = () => {
    if (selected) {
      sendPlayerMessage(
        socketClient,
        playerInfo.playerId,
        "sent/report",
        `{"reporteeName":${taxThief}}`
      );
      setReported(true);
      console.log(`${taxThief} has been reported.`);
    } else {
      alert("플레이어를 선택하세요.");
    }
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
                selected ? "selected" : ""
              }`}
              style={{
                cursor: `${selected ? "" : "pointer"}`,
                color: `#${player.color}`,
              }}
              onClick={() => selectPlayer(player.name, player.color)}
            >
              {player.name}
            </div>
          ))}
          <div
            className={`questionBox ${
              selected && !reported ? "selectedBoxVisible" : ""
            }`}
          >
            <div>해당 플레이어를 탈세자로 신고하겠습니까?</div>
            <div>
              허위 신고 시 <span style={{ color: "red" }}>과태료</span>가
              부과됩니다.
            </div>
          </div>
          <div
            className={`selectedBox ${
              selected && !reported ? "selectedBoxVisible" : ""
            }`}
            style={{ color: `#${taxThiefColor}` }}
          >
            {taxThief}
          </div>
          <div
            className={`questionBox ${
              selected && reported ? "selectedBoxVisible" : ""
            }`}
            style={{ top: "40%", fontSize: "80px" }}
          >
            신고 완료!
          </div>
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
              selected && !reported ? "cancelButtonVisible" : ""
            }`}
            style={{
              cursor: "pointer",
            }}
            onClick={chooseAgain}
          >
            다시 고르기
          </button>
          <button
            className={`reportButton glowingButton ${
              selected && !reported ? "reportButtonVisible" : ""
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
