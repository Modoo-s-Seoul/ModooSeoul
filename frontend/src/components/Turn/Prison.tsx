import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  tcolState,
  trowState,
  // isPrisonState,
  isUserTurnVisibleState,
  playerInfoState,
  turnState,
  whoAreYouState,
  isPrisonState,
} from "../../data/IngameData";
import { useEffect, useState } from "react";
import { boardDataState } from "../../data/BoardData";
import "./Prison.css";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";

/** 감옥칸 */
export default function Prison() {
  // 기본 인자
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  // const setIsPrison = useSetRecoilState(isPrisonState); // 감옥 반영
  const turn = useRecoilValue(turnState);
  const whoAreYou = useRecoilValue(whoAreYouState);
  const setPrison = useSetRecoilState(isPrisonState);

  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  // 시간 제한 인자
  const [timeCnt, setTimeCnt] = useState(3);
  // const setTurn = useSetRecoilState(turnState);
  const setUserTurn = useSetRecoilState(isUserTurnVisibleState);

  /** 감옥 여부 반영 */
  useEffect(() => {
    // 실제구현 (감옥반영 요청)
    // 가구현
    // setIsPrison(true);
  }, []);

  // 초측정
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCnt > 0) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        // 0초일시 턴 넘기기 (비활성화)
        if (turn == whoAreYou) {
          // 턴정보 받아오기 요청
          sendWsMessage(socketClient, playerInfo.gameId, "send/turn");
          // 감옥여부 전역 반영
          setPrison(true);
        }
        setUserTurn(false);
        /** 감옥 여부 초기화  */
      }
    }, 1000);
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [timeCnt]);

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 중단 - 본 내용 */}
        <div className="prisonBody">
          <div className="userTurnTitle">{turnData.name}</div>
          <div>이번 라운드 자유행동 금지</div>
        </div>
        {/* 하단 - 기능 버튼 */}
      </div>
    </>
  );
}
