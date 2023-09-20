import { useRecoilValue } from "recoil";
import { tcolState, trowState } from "../../data/IngameData";
import { useState } from "react";
import { boardDataState } from "../../data/BoardData";
import CloseBtn from "./CloseBtn";

export default function Subway() {
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <CloseBtn />
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
