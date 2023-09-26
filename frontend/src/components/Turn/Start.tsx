import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isModalMsgActiveState,
  isStartActiveState,
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
import "./Start.css";
import MessageModal from "../Base/MessageModal";

export default function Start() {
  // 기본 인자
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const turn = useRecoilValue(turnState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const SetIsUserTurnVisible = useSetRecoilState(isUserTurnVisibleState);
  const SetIsStartActive = useSetRecoilState(isStartActiveState); // 시작점 토글(board에서 감지)
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 모달 메세지 토글
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지

  // 데이터 보관
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const matchPos = useRecoilValue(matchPosition); // 매칭데이터

  /** 클릭시 */
  const toggleSelectStart = () => {
    // 선택가능한 땅 판별
    let canAct = false;
    for (let i = 0; i < matchPos.length; i++) {
      const row = matchPos[i].row;
      const col = matchPos[i].col;
      if (boardData[`${row}-${col}`].player == turn) {
        canAct = true;
        break;
      }
    }

    if (canAct) {
      // 선택가능한 땅이 있을때
      SetIsStartActive(true);
      SetIsUserTurnVisible(false);
    } else {
      // 선택가능한 땅이 없을때 - 메세지 표기 , 턴넘기기
      console.log("보여");
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
        <div className="startBody">
          <div className="userTurnTitle">{turnData.name}</div>
          <div>시작점 도착!</div>
          <div>월급 흭득</div>
        </div>
        {/* 하단 - 기능 버튼 */}
        <MessageModal />
        <div className="userTurnFooter">
          <div className="startSelectBtn" onClick={toggleSelectStart}>
            <CustomButton
              fontsize={24}
              width={140}
              height={50}
              text="내땅에 건설"
            />
          </div>
        </div>
      </div>
    </>
  );
}
