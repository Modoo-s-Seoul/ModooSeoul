import { useEffect } from "react";
import { useSocket } from "../../pages/SocketContext";
import { useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  selectedNewsState,
  playerDataState,
  displayPlayerDataState,
  roundState,
  turnState,
  timerState,
  dice1State,
  dice2State,
  isPrisonState,
} from "../../data/IngameData";

export default function IngameWebSocket() {
  // 세팅할 데이터들
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 인게임 정보
  const setDisplayPlayerData = useSetRecoilState(displayPlayerDataState); // 출력용 플레이어 인게임 정보
  const setRound = useSetRecoilState(roundState); // 현재 라운드
  const setTurn = useSetRecoilState(turnState); // 현재 플레이 순서
  const setTimer = useSetRecoilState(timerState); // 현재 플레이 순서
  const setSelectedNews = useSetRecoilState(selectedNewsState); // 뉴스
  const setDice1Value = useSetRecoilState(dice1State);
  const setDice2Value = useSetRecoilState(dice2State);
  const setPrison = useSetRecoilState(isPrisonState);

  // 게임 정보
  const weblocation = useLocation();
  let gameId = "test";
  let playerId = "test";
  gameId;
  if (weblocation.state) {
    gameId = weblocation.state.gameId;
    playerId = weblocation.state.playerId;
  }
  /**웹소켓 클라이언트 */
  const socketClient = useSocket();

  /** 초기구독 */
  useEffect(() => {
    // WebSocket 연결 설정 및 관리 코드를 이곳에 추가하세요.
    if (socketClient !== null) {
      //// 공통 구독 ////

      // 플레이어 기본 정보/순서 확인
      socketClient.subscribe(`/receive/game/players-info/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);

        // 자본금 지금
        const newPlayerData = [...playerData];
        for (let i = 0; i < receivedData.length; i++) {
          newPlayerData[i] = {
            ...newPlayerData[i],
            name: receivedData[i].nickname,
            cash: receivedData[i].cash,
            totalAsset: receivedData[i].totalAsset,
          };
        }
        setPlayerData(newPlayerData);
        setDisplayPlayerData(newPlayerData);
      });

      //라운드 시작
      socketClient.subscribe(`/receive/game/round-start/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setRound(receivedData.currentRound);
        /* 주식 정보 업데이트 */
      });

      //타이머 시작,완료,취소 알림
      socketClient.subscribe(`/receive/game/timer/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setTimer(receivedData.isTimerActivated);
        setTurn(receivedData.turnInfo);
      });

      //공통 턴 행동 완료
      socketClient.subscribe(`/receive/game/action-finish/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 주사위 굴리기
      socketClient.subscribe(`/receive/game/roll/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setDice1Value(receivedData.first);
        setDice2Value(receivedData.second);
      });

      // 땅 구매
      socketClient.subscribe(
        `/receive/game/purchase/ground/${gameId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          const receivedData = res.data;
          console.log(receivedData);
        }
      );

      // 건물 구매
      socketClient.subscribe(
        `/receive/game/purchase/building/${gameId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          const receivedData = res.data;
          console.log(receivedData);
        }
      );

      //도착한 땅에 대한 행동 요청
      socketClient.subscribe(
        `/receive/game/arrive-board-info/${gameId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          const receivedData = res.data;
          console.log(receivedData);
        }
      );

      //투옥
      socketClient.subscribe(`/receive/game/prison/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setPrison(receivedData.isPrisoned);
      });

      //공통 턴 시작
      socketClient.subscribe(`/receive/game/free-action/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //출발지 도착
      socketClient.subscribe(`/receive/game/start/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //오일랜드 도착
      socketClient.subscribe(`/receive/game/oil-land/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //지하철 이용 여부 확인
      socketClient.subscribe(`/receive/game/check-subway/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //지하철 이동
      socketClient.subscribe(`/receive/game/subway/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //찬스 카드 도착
      socketClient.subscribe(`/receive/game/chance/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //공통 턴 준비
      socketClient.subscribe(`/receive/game/action-finish/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //플레이어 퇴장
      socketClient.subscribe(`/receive/game/player-leave/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //게임 종료
      socketClient.subscribe(`/receive/game/end/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //// 개별 구독 ////

      //배당금 확인
      socketClient.subscribe(`/receive/dividend/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 뉴스 선택, 확인
      socketClient.subscribe(`/receive/news/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setSelectedNews(receivedData.description);
      });

      // 땅 판매
      socketClient.subscribe(`/receive/ground/sell/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 건물 판매
      socketClient.subscribe(`/receive/building/sell/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 주식 구매
      socketClient.subscribe(`/receive/stock/purchase/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 주식 판매
      socketClient.subscribe(`/receive/stock/sell/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 개인 주식정보 확인
      socketClient.subscribe(`/receive/stock/info/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 탈세자 신고
      socketClient.subscribe(`/receive/report/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 탈세자 신고 결과 공지
      socketClient.subscribe(`/receive/evasion-check/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //세금 납,탈세 상태 확인
      socketClient.subscribe(`/receive/tax/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 찬스 카드 확인
      socketClient.subscribe(`/receive/chance/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });
    }

    // 컴포넌트가 언마운트될 때 WebSocket 연결을 닫습니다.
    return () => {};
  }, []);
  return null;
}
