import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isOilActiveState,
  isUserTurnVisibleState,
  tcolState,
  trowState,
} from "../../data/IngameData";
import { useState } from "react";
import { boardDataState } from "../../data/BoardData";
import CloseBtn from "./CloseBtn";
import CustomButton from "../Base/CustomButton";
import "./Oil.css";

export default function Oil() {
  // 기본 인자
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const SetIsUserTurnVisible = useSetRecoilState(isUserTurnVisibleState);
  const SetIsOilActive = useSetRecoilState(isOilActiveState); // 오일 토글(board에서 감지)
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const toggleSelectOil = () => {
    SetIsOilActive(true);
    SetIsUserTurnVisible(false);
  };

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <CloseBtn />
        </div>
        {/* 중단 - 본 내용 */}
        <div className="oilBody">
          <div className="userTurnTitle">{turnData.name}</div>
          <div>오일랜드 도착!</div>
          <div>지정 땅 통행료 2배!</div>
        </div>
        {/* 하단 - 기능 버튼 */}
        <div className="userTurnFooter">
          <div className="oilSelectBtn" onClick={toggleSelectOil}>
            <CustomButton
              fontsize={24}
              width={120}
              height={50}
              text="땅 선택"
            />
          </div>
        </div>
      </div>
    </>
  );
}
