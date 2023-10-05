import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  builingInfoState,
  isModalMsgActiveState,
  isStartActiveState,
  isUserTurnVisibleState,
  matchPosition,
  modalMsgState,
  playerInfoState,
  scolState,
  srowState,
  tcolState,
  trowState,
  turnState,
  whoAreYouState,
} from "../../data/IngameData";
import { useEffect, useState } from "react";
import { boardDataState } from "../../data/BoardData";
import CloseBtn from "./CloseBtn";
import CustomButton from "../Base/CustomButton";
import "./Start.css";
import MessageModal from "../Base/MessageModal";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";

export default function Start() {
  // 기본 인자
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const sRow = useRecoilValue(srowState); // 선택 장소 row
  const sCol = useRecoilValue(scolState); // 선택 장소 col
  const turn = useRecoilValue(turnState); // 현재 턴
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const SetIsUserTurnVisible = useSetRecoilState(isUserTurnVisibleState);
  const SetIsStartActive = useSetRecoilState(isStartActiveState); // 시작점 토글(board에서 감지)
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 모달 메세지 토글
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지

  // 데이터 보관
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const [selectData, setSelectData] = useState(boardData[`${sRow}-${sCol}`]); // 선택 장소 데이터
  const [builingData] = useRecoilState(builingInfoState); // 건물 데이터
  const matchPos = useRecoilValue(matchPosition); // 매칭데이터
  // 플레이어 정보
  const whoAreyou = useRecoilValue(whoAreYouState);
  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  /** 클릭시 */
  const toggleSelectStart = () => {
    // 선택가능한 땅 판별
    let canAct = false;
    for (let i = 0; i < matchPos.length; i++) {
      const row = matchPos[i].row;
      const col = matchPos[i].col;
      if (boardData[`${row}-${col}`].player == turn) {
        // 지을수 있는 건물이 있으면
        for (let j = 0; j < 3; j++) {
          if (!builingData[selectData.index * 3 + j].sell) {
            canAct = true;
            break;
          }
        }
        if (canAct) {
          break;
        }
      }
    }

    if (canAct) {
      // 선택가능한 땅이 있을때
      SetIsStartActive(true);
      SetIsUserTurnVisible(false);
    } else {
      // 선택가능한 땅이 없을때 - 메세지 표기 , 턴넘기기
      setModalMsg("선택가능한 땅이 없습니다.");
      setIsModalMsgActive(true);
    }
  };

  /** 클릭데이터 반영 */
  useEffect(() => {
    setSelectData(boardData[`${sRow}-${sCol}`]);
  }, [sCol, sRow]);

  // 타이머 관련
  useEffect(() => {
    // 타이머 요청 (본인 턴일때만 요청)
    if (turn == whoAreyou) {
      // sendWsMessage(
      //   socketClient,
      //   playerInfo.gameId,
      //   `send/timer`,
      //   `{"timerType":"STARTING_POINT_ARRIVAL"}`
      // );
      // 언마운트시 타이머 해제
      return () => {
        // sendWsMessage(socketClient, playerInfo.playerId, "/send/timer-cancel");
      };
    }
  }, []);

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
