import { useRecoilState, useRecoilValue } from "recoil";
import {
  isUserTurnVisibleState,
  tcolState,
  trowState,
} from "../../data/IngameData";
import ClickBtn from "../Base/ClickBtn";
import { boardDataState } from "../../data/BoardData";
import { useState } from "react";

export default function Ground() {
  const [, setIsUserTurnVisible] = useRecoilState(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터

  // 땅 구매
  const buyGround = () => {
    console.log(turnData);
    buyBuilding;
  };
  // 건물 구매
  const buyBuilding = () => {
    console.log(turnData);
  };

  return (
    <>
      <div className={"ground"}>
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
          <div>위치 : {turnData.name}</div>
          <div>가격 : {turnData.price}</div>
          <div>통행료 : {turnData.cost}</div>
        </div>
        {/* 하단 - 기능 버튼 */}
        {turnData.sell == false && (
          <div onClick={buyGround}>
            <ClickBtn height={50} width={180} fontsize={30} text={"땅구매"} />
          </div>
        )}
      </div>
    </>
  );
}
