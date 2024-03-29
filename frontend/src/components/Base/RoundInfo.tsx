import { useRecoilValue } from "recoil";
import "./RoundInfo.css";
import {
  pNumState,
  playerDataState,
  roundState,
  turnState,
} from "../../data/IngameData";

export default function RoundInfo() {
  // 턴정보를 바탕으로
  const turn = useRecoilValue(turnState);
  const pNum = useRecoilValue(pNumState);
  const round = useRecoilValue(roundState);
  const playerData = useRecoilValue(playerDataState);

  return (
    <>
      <div className="roundInfoContainer">
        <div className="roundInfoInnerContainer">
          <div className="roundInfoText">{`라운드 ${round}/10`}</div>
          <div className="selectorContainer">
            <div className="selectorInnerContainer">
              <div
                className={`${"selectorBox"} ${
                  turn === pNum + 1 ? "selectorTopArrow selectorActive" : ""
                }`}
              >
                뉴스선택
              </div>
              <div
                className={`${"selectorBox"} ${
                  turn === 0 ? "selectorTopArrow selectorActive" : ""
                }`}
              >
                {playerData[0].name}
              </div>
              <div
                className={`${"selectorBox"} ${
                  turn === 1 ? "selectorTopArrow selectorActive" : ""
                }`}
              >
                {playerData[1].name}
              </div>
              {pNum !== 2 && (
                <div
                  className={`${"selectorBox"} ${
                    turn === 2 ? "selectorTopArrow selectorActive" : ""
                  }`}
                >
                  {playerData[2].name}
                </div>
              )}
              {pNum === 4 && (
                <div
                  className={`${"selectorBox"} ${
                    turn === 3 ? "selectorTopArrow selectorActive" : ""
                  }`}
                >
                  {playerData[3].name}
                </div>
              )}

              <div
                className={`${"selectorBox"} ${
                  turn === pNum ? "selectorTopArrow selectorActive" : ""
                }`}
              >
                자유행동
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
