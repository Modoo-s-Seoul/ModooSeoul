import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { useSocket } from "../../../pages/SocketContext";
import {
  roundState,
  turnState,
  isNewsVisibleState,
  playerInfoState,
  selectedNewsState,
  pNumState,
  stockLabelState,
} from "../../../data/IngameData";
import TimeBar from "../../Base/TimeBar";
import "./News.css";
import { sendWsMessage } from "../../IngameWs/IngameSendFunction";

export default function News() {
  // 기본 인자

  /** 이 값을 조정해 뉴스 떠있는 시간 조정 */
  const newsTime = 10;
  const socketClient = useSocket();
  const [timeCnt, setTimeCnt] = useState(newsTime); // 시간 제한 5초
  const cards = [1, 2, 3, 4];
  const [selected, setSelected] = useState(false);
  const playerInfo = useRecoilValue(playerInfoState); // 플레이어 고유 정보
  const round = useRecoilValue(roundState); // 현재 라운드 수
  const [turn, setTurn] = useRecoilState(turnState); // 현재 턴 수
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const setNewsVisible = useSetRecoilState(isNewsVisibleState);
  const selectedNews = useRecoilValue(selectedNewsState);
  const [stockLabel, setStockLabel] = useRecoilState(stockLabelState);

  const getNews = (idx: number) => {
    sendWsMessage(
      socketClient,
      playerInfo.playerId,
      `send/news`,
      `{"currentRound":${round},"cardIdx":${idx}}`
    );
    console.log(idx);
    setSelected(true);
  };

  // 초측정
  useEffect(() => {
    console.log("턴: ", turn);
    // 턴 수가 뉴스 턴이 아닐 경우 자동으로 꺼짐(개발용)
    if (turn != pNum + 1) {
      setNewsVisible(false);
    }

    const timer = setInterval(() => {
      if (timeCnt > 1) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        // 0초일시 턴 넘기기 (비활성화)
        setNewsVisible(false);
        setTurn(0);
      }
    }, 1000);
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [turn]);

  useEffect(() => {
    console.log("선택된 뉴스:", selectedNews);
  }, [selectedNews]);

  useEffect(() => {
    sendWsMessage(
      socketClient,
      playerInfo.gameId,
      "send/timer",
      `{"timerType":"SELECT_NEWS"}`
    );
    sendWsMessage(socketClient, playerInfo.gameId, "send/round-start");
    const newLabel = [...stockLabel, `${round}R`];
    setStockLabel(newLabel);
  }, []);

  return (
    <>
      <div className="newsPageContainer">
        <div className="newsPageTitle">뉴스를 선택하세요!</div>
        <TimeBar duration={newsTime} />
        <div className="newsCardContainer">
          {cards.map((ele, index) => {
            return (
              <div
                className={`newsCard ${selected ? "newsCardFade" : ""}`}
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => getNews(ele)}
              >
                {ele}
              </div>
            );
          })}
          <div className={`selectedNews ${selected ? "showSelectedNews" : ""}`}>
            <h2>{selectedNews}</h2>
          </div>
        </div>
      </div>
    </>
  );
}
