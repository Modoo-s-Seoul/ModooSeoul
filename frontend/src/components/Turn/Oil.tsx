import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isModalMsgActiveState,
  isOilActiveState,
  isUserTurnVisibleState,
  matchPosition,
  modalMsgState,
  tcolState,
  trowState,
  turnState,
} from "../../data/IngameData";
import { useState } from "react";
import { boardDataState } from "../../data/BoardData";
import CloseBtn from "./CloseBtn";
import CustomButton from "../Base/CustomButton";
import "./Oil.css";
import MessageModal from "../Base/MessageModal";

export default function Oil() {
  // 기본 인자
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const turn = useRecoilValue(turnState); // 현재 턴
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const SetIsUserTurnVisible = useSetRecoilState(isUserTurnVisibleState);
  const SetIsOilActive = useSetRecoilState(isOilActiveState); // 오일 토글(board에서 감지)
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 모달 메세지 토글
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지

  // 데이터 보관
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const matchPos = useRecoilValue(matchPosition); // 매칭데이터

  /** 오일랜드 선택시도시 */
  const toggleSelectOil = () => {
    // 선택가능한 땅 판별
    let canAct = false;
    for (let i = 0; i < matchPos.length; i++) {
      const row = matchPos[i].row;
      const col = matchPos[i].col;
      if (boardData[`${row}-${col}`].player == turn) {
        // 지을수 있는 땅이 있으면
        canAct = true;
        break;
      }
    }

    if (canAct) {
      // 선택가능한 땅이 있을때
      SetIsOilActive(true);
      SetIsUserTurnVisible(false);
    } else {
      // 선택가능한 땅이 없을때 - 메세지 표기 , 턴넘기기
      setModalMsg("선택가능한 땅이 없습니다.");
      setIsModalMsgActive(true);
    }
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
        <MessageModal />
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
