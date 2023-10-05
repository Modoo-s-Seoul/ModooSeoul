import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  displayPlayerDataState,
  isEvadeState,
  isUserTurnVisibleState,
  playerDataState,
  playerInfoState,
} from "../../data/IngameData";
import "./Tax.css";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";

export default function Tax() {
  // 기본인자
  const setDisplayPlayerData = useSetRecoilState(displayPlayerDataState); // 플레이어 전광판 정보
  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보
  // 데이터 보관
  const [playerData] = useRecoilState(playerDataState);
  // 시간 제한 인자
  const [timeCnt, setTimeCnt] = useState(5);
  const setUserTurn = useSetRecoilState(isUserTurnVisibleState);
  const isEvade = useRecoilValue(isEvadeState);

  /** 초측정 */
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCnt > 0) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        // 0초일시 턴 넘기기 (비활성화)
        setUserTurn(false);
        sendWsMessage(socketClient, playerInfo.gameId, "send/turn");
        /** 감옥 여부 초기화  */
      }
    }, 1000);
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
      setDisplayPlayerData(playerData);
    };
  }, [timeCnt]);

  /** 탈세 검증 */
  useEffect(() => {
    // 실제구현 - send 요청
    sendWsMessage(socketClient, playerInfo.playerId, "send/tax-service");
  }, []);

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 중단 - 본 내용 */}
        <div className="taxBody">
          <div className="userTurnTitle">국세청</div>
          <div>세무조사를 실시합니다.</div>
          <div>※ 탈세 적발시 미납추징금 3배 부과 ※</div>
          <div>※ 모범 납세자에게는 50만원의 위로금 지급 ※</div>
          {timeCnt <= 3 && (
            <div className="userTurnTitle">
              결과 : {isEvade ? "탈세 적발" : "모범 납세 확인"}
            </div>
          )}
        </div>
        {/* 하단 - 기능 버튼 */}
      </div>
    </>
  );
}
