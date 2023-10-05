import { useEffect } from "react";
import { useSocket } from "../../pages/SocketContext";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  selectedNewsState,
  playerDataState,
  playerInfoState,
  roundState,
  turnState,
  timerState,
  dice1State,
  dice2State,
  stockState,
  diceActiveState,
  whoAreYouState,
  groundChangeState,
  dividendState,
  playerStockInfoState,
  // builingInfoState,
  buildingChangeState,
  isGameEndVisibleState,
  rankingDataState,
} from "../../data/IngameData";
import { matchIndex } from "./../../data/IngameData";
import { sendWsMessage } from "./IngameSendFunction";

export default function IngameWebSocket() {
  // 기본 인자
  const [, setWhoAreYou] = useRecoilState(whoAreYouState);
  // 데이터
  const matchIndexList = useRecoilValue(matchIndex);

  // 세팅할 데이터들
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 인게임 정보
  const setPlayerInfo = useSetRecoilState(playerInfoState); // 플레이어 인게임 정보
  const setRound = useSetRecoilState(roundState); // 현재 라운드
  const setTurn = useSetRecoilState(turnState); // 현재 플레이 순서
  const setTimer = useSetRecoilState(timerState); // 현재 플레이 순서
  const setSelectedNews = useSetRecoilState(selectedNewsState); // 뉴스
  const setDice1Value = useSetRecoilState(dice1State);
  const setDice2Value = useSetRecoilState(dice2State);
  const [stock, setStock] = useRecoilState(stockState);
  const setDiceActive = useSetRecoilState(diceActiveState); // 주사위 상태
  const [, setGroundChange] = useRecoilState(groundChangeState); // 땅 변경정보
  const setDividend = useSetRecoilState(dividendState);
  const setStockInfo = useSetRecoilState(playerStockInfoState);
  // const [builingData, setBuildingInfo] = useRecoilState(builingInfoState); // 건물 데이터
  const [, setBuildingChange] = useRecoilState(buildingChangeState); // 건물 변경정보
  const setIsGameEndVisible = useSetRecoilState(isGameEndVisibleState); // 게임 종료 토글
  const setRankingData = useSetRecoilState(rankingDataState);

  // 게임 정보
  const weblocation = useLocation();
  let gameId = "test";
  let playerId = "test";
  let nickname = "test";
  gameId;
  if (weblocation.state) {
    gameId = weblocation.state.gameId;
    playerId = weblocation.state.playerId;
    nickname = weblocation.state.nickname;
  }
  /**웹소켓 클라이언트 */
  const socketClient = useSocket();

  /** 초기구독 */
  useEffect(() => {
    if (weblocation.state) {
      setPlayerInfo({
        nickname: weblocation.state.nickname,
        gameId: gameId,
        playerId: playerId,
      });
    }
    // WebSocket 연결 설정 및 관리 코드를 이곳에 추가하세요.
    if (socketClient !== null) {
      //// 공통 구독 ////

      // 플레이어 기본 정보/순서 확인
      socketClient.subscribe(`/receive/game/players-info/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        // 자본금 지급
        const newPlayerData = [...playerData];
        for (let i = 0; i < receivedData.length; i++) {
          newPlayerData[i] = {
            ...newPlayerData[i],
            name: receivedData[i].nickname,
            cash: receivedData[i].cash,
            totalAsset: receivedData[i].totalAsset,
          };
          // 본인의 턴 기록
          if (nickname == receivedData[i].nickname) {
            setWhoAreYou(i);
            console.log("본인의 턴은", i, "입니다.");
          }
        }
        setPlayerData(newPlayerData);
      });

      //라운드 시작
      socketClient.subscribe(`/receive/game/round-start/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("round-start: ", receivedData);
        setRound(receivedData.currentRound);
        /* 주식 정보 업데이트 */
        const newStock = [...stock];
        for (let i = 0; i < 3; ++i) {
          if (newStock[i].stockName.length === 0) {
            newStock[i] = {
              ...newStock[i],
              stockName: receivedData.stockName[i],
            };
          }
          newStock[i] = {
            ...newStock[i],
            currentPrice: receivedData.stockPrices[i],
            stockHistory: receivedData.stockPricesHistory[i],
          };
        }

        setStock(newStock);
      });

      //타이머 시작,완료,취소 알림
      socketClient.subscribe(`/receive/game/timer/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setTimer(receivedData.isTimerActivated);
        setTurn(receivedData.turnInfo);
      });

      // 턴 정보 확인
      socketClient.subscribe(`/receive/game/turn/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("턴정보확인 응답", receivedData);
        setTurn(receivedData.turnInfo);
      });

      // 턴 종료
      socketClient.subscribe(`/receive/game/pass-turn/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("턴종료 응답", receivedData);
        setTurn(receivedData.turnInfo);
      });

      //공통 턴 행동 완료
      socketClient.subscribe(`/receive/game/action-finish/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setTimer(receivedData.isTimerActivated);
        setTurn(receivedData.turnInfo);
      });

      // 주사위 굴리기
      socketClient.subscribe(`/receive/game/roll/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("주사위굴리기 응답", receivedData);
        setDice1Value(receivedData.first);
        setDice2Value(receivedData.second);
        setDiceActive(true);
      });

      // 땅 구매
      socketClient.subscribe(
        `/receive/game/purchase/ground/${gameId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          const receivedData = res.data;
          console.log("땅구매 응답", receivedData);
          // 구매 가능할시
          if (receivedData.isPurchase) {
            // 땅 변동사항 업데이트
            setGroundChange([
              {
                player: receivedData.playerIdx,
                index: matchIndexList[receivedData.groundIdx - 1],
              },
            ]);
            // 돈정보 업데이트
            const gameId = weblocation.state.gameId;
            sendWsMessage(socketClient, gameId, "send/players-info");
          }
        }
      );

      // 건물 구매
      socketClient.subscribe(
        `/receive/game/purchase/building/${gameId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          const receivedData = res.data;
          console.log("건물구매 응답", receivedData);
          // 구매성공시
          if (receivedData.isPurchase) {
            const index = receivedData.boardIdx - 1;
            const order = matchIndexList[index];
            // 스프라이트 변동 요청
            setBuildingChange([
              {
                player: receivedData.playerIdx,
                index: order * 3,
                point: receivedData.buildingIdx - 1,
                industry: receivedData.buildingId - 1,
              },
            ]);
            // 돈정보 업데이트
            const gameId = weblocation.state.gameId;
            sendWsMessage(socketClient, gameId, "send/players-info");
          }
        }
      );

      //도착한 땅에 대한 행동 요청
      socketClient.subscribe(
        `/receive/game/arrive-board-info/${gameId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          const receivedData = res.data;
          console.log("도착한땅에대한행동 응답", receivedData);
        }
      );

      //감옥
      socketClient.subscribe(`/receive/game/prison/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("감옥 응답", receivedData);
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
        console.log("출발지 응답", receivedData);
      });

      //오일랜드 도착
      socketClient.subscribe(`/receive/game/oil-land/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("오일랜드 응답", receivedData);
      });

      //지하철 이용 여부 확인
      socketClient.subscribe(`/receive/game/check-subway/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("지하철 이용여부 응답", receivedData);
      });

      //지하철 이동
      socketClient.subscribe(`/receive/game/subway/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("지하철 응답", receivedData);
      });

      //찬스 카드 도착
      socketClient.subscribe(`/receive/game/chance/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("찬스카드 응답", receivedData);
      });

      //공통 턴 준비
      socketClient.subscribe(`/receive/game/action-finish/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //타이머 시작,완료,취소 알림
      socketClient.subscribe(`/receive/game/timer/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      //공통 턴 행동 완료
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
        console.log("게임종료 응답", receivedData);
        // 게임 종료 선언
        setIsGameEndVisible(true);
        // 랭킹 데이터 업데이트
        setRankingData(receivedData.playerList);
      });

      //// 개별 구독 ////

      //배당금 확인
      socketClient.subscribe(`/receive/dividend/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setDividend(receivedData.dividend);
      });

      // 뉴스 선택, 확인
      socketClient.subscribe(`/receive/news/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        setSelectedNews(receivedData.description);
      });

      // 땅 판매
      socketClient.subscribe(`/receive/game/ground-sell/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("땅판매시도", receivedData);
        // 땅 변동 요청
        setGroundChange([
          { player: 6, index: matchIndexList[receivedData.groundIdx - 1] },
        ]);
        // 건물 변동 요청
        const index = receivedData.groundIdx - 1;
        const order = matchIndexList[index];
        setBuildingChange([
          { player: 6, index: order * 3, point: 0, industry: -1 },
          { player: 6, index: order * 3, point: 1, industry: -1 },
          { player: 6, index: order * 3, point: 2, industry: -1 },
        ]);
      });

      // 건물 판매
      socketClient.subscribe(`/receive/building/sell/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
      });

      // 주식 구매
      socketClient.subscribe(`/receive/stock/purchase/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        if (receivedData.status) {
          console.log("주식 매수 성공: ", receivedData);
          const newStockInfo = {
            playerStockMoney: receivedData.playerStockMoney,
            prevStockMoney: receivedData.prevStockMoney,
            stockNames: receivedData.stockNames,
            purchasePrices: receivedData.purchasePrices,
            stockAmounts: receivedData.stockAmounts,
            stockPrices: receivedData.stockPrices,
          };

          setStockInfo(newStockInfo);
          sendWsMessage(socketClient, gameId, `send/players-info`);
        } else {
          console.log(receivedData.message);
        }
      });

      // 주식 판매
      socketClient.subscribe(`/receive/stock/sell/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log(receivedData);
        if (receivedData.status) {
          console.log("주식 매도 성공: ", receivedData);
          const newStockInfo = {
            playerStockMoney: receivedData.playerStockMoney,
            prevStockMoney: receivedData.prevStockMoney,
            stockNames: receivedData.stockNames,
            purchasePrices: receivedData.purchasePrices,
            stockAmounts: receivedData.stockAmounts,
            stockPrices: receivedData.stockPrices,
          };

          setStockInfo(newStockInfo);
          sendWsMessage(socketClient, gameId, `send/players-info`);
        } else {
          console.log(receivedData.message);
        }
      });

      // 개인 주식정보 확인
      socketClient.subscribe(`/receive/stock/info/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        const receivedData = res.data;
        console.log("개인 주식 정보: ", receivedData);
        if (receivedData.status) {
          const newStockInfo = {
            playerStockMoney: receivedData.playerStockMoney,
            prevStockMoney: receivedData.prevStockMoney,
            stockNames: receivedData.stockNames,
            purchasePrices: receivedData.purchasePrices,
            stockAmounts: receivedData.stockAmounts,
            stockPrices: receivedData.stockPrices,
          };

          setStockInfo(newStockInfo);
        }
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
