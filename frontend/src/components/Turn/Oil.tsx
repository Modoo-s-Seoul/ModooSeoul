import { useRecoilState, useRecoilValue } from "recoil";
import {
  isUserTurnVisibleState,
  tcolState,
  trowState,
} from "../../data/IngameData";
import { useState } from "react";
import { boardDataState } from "../../data/BoardData";

export default function Oil() {
  const [, setIsUserTurnVisible] = useRecoilState(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  return (
    <>
      <div className={"oil"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <button
            onClick={() => setIsUserTurnVisible(false)}
            className="closeUserTurn"
            style={{ cursor: "pointer" }}
          >
            ✖
          </button>
        </div>
        {/* 중단 - 본 내용 */}
        <div>
          <div>{turnData.name}</div>
        </div>
        {/* 하단 - 기능 버튼 */}
      </div>
    </>
  );
}
