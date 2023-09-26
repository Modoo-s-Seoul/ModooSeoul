import { useEffect } from "react";
import { useSocket } from "../../pages/SocketContext";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { selectedNewsState } from "../../data/IngameData";

export default function IngameWebSocket() {
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

  // 세팅할 데이터들
  const setSelectedNews = useSetRecoilState(selectedNewsState); // 뉴스

  /** 초기구독 */
  useEffect(() => {
    // WebSocket 연결 설정 및 관리 코드를 이곳에 추가하세요.
    if (socketClient !== null) {
      console.log("초기 방 구독을 시작합니다");

      //// 공통 구독 ////
      // 구독 0. 턴정보
      socketClient.subscribe(`/receive/game/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub0 Turn:", res);
        // const receivedData = res.data;
      });
      // 구독1. 주사위 정보
      socketClient.subscribe(`/receive/game/roll/${gameId}`, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub1 Roll dice:", res);
        // const receivedData = res.data;
      });
      // 구독2. 땅 구매
      socketClient.subscribe(
        `/receive/game/purchase/ground/${playerId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          console.log("Ingame Sub2 Buy ground:", res);
          // const receivedData = res.data;
        }
      );
      // 구독 3. 건물 구매
      socketClient.subscribe(
        `/receive/game/purchase/building/${playerId}`,
        (msg) => {
          const res = JSON.parse(msg.body);
          console.log("Ingame Sub 3 Buy building:", res);
          // const receivedData = res.data;
        }
      );
      // 구독 4. 통행료 지불
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 4 Toll fee:", res);
        // const receivedData = res.data;
      });
      // 구독 5. 세금 납세 / 탈세
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 5 tax :", res);
        // const receivedData = res.data;
      });
      // 구독 6. 출발지 도착
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 6 arrive start:", res);
        // const receivedData = res.data;
      });
      // 구독 7. 오일랜드 도착
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 7 arrive oil:", res);
        // const receivedData = res.data;
      });
      // 구독 8. 지하철 도착
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 8 arrive subway:", res);
        // const receivedData = res.data;
      });
      // 구독 9. 찬스카드 도착
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 9 arrive chance:", res);
        // const receivedData = res.data;
      });
      // 구독 10. 감옥 도착
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 10 arrive prison:", res);
        // const receivedData = res.data;
      });
      // 구독 11. 탈세 신고 결과
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 11 tax-thief-catch result:", res);
        // const receivedData = res.data;
      });
      // 구독 12. 1분 액션 준비완료
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 12 common turn ready:", res);
        // const receivedData = res.data;
      });
      // 구독 13. 1분 액션 만료
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 13 common done:", res);
        // const receivedData = res.data;
      });
      // 구독 14. 플레이어 퇴장
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 14 player exit:", res);
        // const receivedData = res.data;
      });
      // 구독 15. 게임 종료
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 15 Game done:", res);
        // const receivedData = res.data;
      });

      //// 개별 구독 ////
      // 구독 1. 뉴스 선택
      socketClient.subscribe(`/receive/news/${playerId}`, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 1 select news:", res);
        const receivedData = res.data;
        setSelectedNews(receivedData.description);
      });

      // 구독 2. 땅 판매
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 2 sell ground:", res);
        // const receivedData = res.data;
      });
      // 구독 3. 건물 판매
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 2 sell building:", res);
        // const receivedData = res.data;
      });
      // 구독 4. 주식 구매
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 4 buy stock:", res);
        // const receivedData = res.data;
      });
      // 구독 5. 주식 판매
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 4 sell stock:", res);
        // const receivedData = res.data;
      });
      // 구독 6. 탈세자 신고
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 6 report tax-thief:", res);
        // const receivedData = res.data;
      });
      // 구독 7. 개인 주식정보 받기
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 7 my stock info:", res);
        // const receivedData = res.data;
      });
      // 구독 8. 뉴스 확인하기
      socketClient.subscribe(``, (msg) => {
        const res = JSON.parse(msg.body);
        console.log("Ingame Sub 8 news check:", res);
        // const receivedData = res.data;
      });
    }

    // 컴포넌트가 언마운트될 때 WebSocket 연결을 닫습니다.
    return () => {};
  }, []);
  return null;
}
