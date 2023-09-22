import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import IngameBox from "../Base/IngameBox";
import { turnState, isNewsVisibleState } from "../../data/IngameData";
import { sendPlayerMessage } from "../IngameWs/IngameSendFunction";
import { selectedNewsState } from "../../data/IngameData";
import TimeBar from "../Base/TimeBar";
import "./News.css";

export default function News() {
  // 기본 인자
  const [timeCnt, setTimeCnt] = useState(5); // 시간 제한 5초
  const setTurn = useSetRecoilState(turnState);
  const setNews = useSetRecoilState(isNewsVisibleState);

  // 초측정
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCnt > 1) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        // 0초일시 턴 넘기기 (비활성화)
        setNews(false);
        setTurn(0);
      }
    }, 1000);
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [timeCnt]);
  return (
    <>
      <div className="newsPageContainer">
        <TimeBar duration={5} />
        {timeCnt}
        <div>News!</div>
      </div>
    </>
  );
}
