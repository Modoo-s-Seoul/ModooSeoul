import { useEffect, useState } from "react";
import "./intro.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isYourTurnVisibleState,
  playerInfoState,
  turnState,
  whoAreYouState,
} from "../../../data/IngameData";
import { useSocket } from "../../../pages/SocketContext";
import { sendWsMessage } from "../../IngameWs/IngameSendFunction";

export default function YourTurn() {
  // 기본 인자
  const [yourTurn, setYourTurn] = useState(0);
  const realTurn = useRecoilValue(whoAreYouState);
  const [isYourTurnVisible, setIsYourTurnVisible] = useRecoilState(
    isYourTurnVisibleState
  ); // 2. 순서정하기

  // 플레이어 정보
  const whoAreyou = useRecoilValue(whoAreYouState);
  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보
  const turn = useRecoilValue(turnState); // 현재 턴

  // 순서 지정 이펙트
  useEffect(() => {
    // 0~9 중에서 랜덤한 숫자를 3초 동안 빠르게 보여줌
    const randomTimer = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 9);
      setYourTurn(randomValue);
    }, 50);

    // 3초 후에 랜덤한 값을 멈추고 특정 값으로 설정
    setTimeout(() => {
      clearInterval(randomTimer);
      setYourTurn(realTurn);
    }, 2000);

    // 6초 후에 언마운트
    setTimeout(() => {
      setIsYourTurnVisible(false);
    }, 5000);

    return () => {
      clearInterval(randomTimer); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, []);

  // 타이머 관련
  useEffect(() => {
    // 타이머 요청 (본인 턴일때만 요청)
    if (turn == whoAreyou) {
      sendWsMessage(
        socketClient,
        playerInfo.gameId,
        `send/timer`,
        `{"timerType":"FTOILLAND_ARRIVAL"}`
      );
      // 언마운트시 타이머 해제
      return () => {
        sendWsMessage(socketClient, playerInfo.playerId, "/send/timer-cancel");
      };
    }
  }, []);

  return (
    <>
      {isYourTurnVisible && (
        <div className="yourTurn">당신의 턴은 {yourTurn + 1}번째 입니다.</div>
      )}
    </>
  );
}
