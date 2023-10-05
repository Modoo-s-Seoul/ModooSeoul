import { useEffect } from "react";
import "./outro.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isGameEndVisibleState,
  isRankingVisibleState,
} from "../../../data/IngameData";

export default function GameEnd() {
  // 기본 인자
  const [isGameEndVisible, setIsGameEndVisible] = useRecoilState(
    isGameEndVisibleState
  ); // 1. 게임 종료 인자
  const setIsRankingvisible = useSetRecoilState(isRankingVisibleState); // 2. 랭킹 컴포넌트

  useEffect(() => {
    // 5초 후에 랜덤한 값을 멈추고 특정 값으로 설정
    setTimeout(() => {
      setIsGameEndVisible(false);
      setIsRankingvisible(true);
    }, 5000);
  }, []);

  return (
    <>{isGameEndVisible && <div className="gameEndLogo">Game Over</div>}</>
  );
}
