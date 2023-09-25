import { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useSocket } from "../../../pages/SocketContext";
import {
  roundState,
  turnState,
  isNewsVisibleState,
  playerInfoState,
} from "../../../data/IngameData";
import { sendPlayerMessage } from "../../IngameWs/IngameSendFunction";
import { selectedNewsState } from "../../../data/IngameData";
import TimeBar from "../../Base/TimeBar";
import "./News.css";

export default function News() {
  // 기본 인자
  const socketClient = useSocket();
  const [timeCnt, setTimeCnt] = useState(10); // 시간 제한 5초
  const cards = [1, 2, 3, 4];
  const [selected, setSelected] = useState(false);
  const playerInfo = useRecoilValue(playerInfoState); // 플레이어 고유 정보
  const round = useRecoilValue(roundState); // 현재 라운드 수
  const setTurn = useSetRecoilState(turnState);
  const setNewsVisible = useSetRecoilState(isNewsVisibleState);
  const selectedNews = useRecoilValue(selectedNewsState);

  const getNews = (idx: number) => {
    // sendPlayerMessage(
    //   socketClient,
    //   playerInfo.playerId,
    //   `send/news`,
    //   `{"currentRound":${round},"cardIdx":${idx}}`
    // );
    setSelected(true);
  };

  // 초측정
  useEffect(() => {
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
  }, [timeCnt]);

  useEffect(() => {
    console.log("선택된 뉴스:", selectedNews);
  }, [selectedNews]);

  return (
    <>
      <div className="newsPageContainer">
        <div className="newsPageTitle">뉴스를 선택하세요!</div>
        <TimeBar duration={10} />
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
