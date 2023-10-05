import { useEffect } from "react";
import "./intro.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isGameStartVisibleState,
  isYourTurnVisibleState,
} from "../../../data/IngameData";

export default function GameStart() {
  // 기본 인자
  const [isGameStartVisible, setIsGameStartVisible] = useRecoilState(
    isGameStartVisibleState
  ); // 1. 게임스타트 인자
  const setIsYourTurnVisible = useSetRecoilState(isYourTurnVisibleState); // 2. 순서정하기

  useEffect(() => {
    // 3초 후에 랜덤한 값을 멈추고 특정 값으로 설정
    setTimeout(() => {
      setIsGameStartVisible(false);
      setIsYourTurnVisible(true);
    }, 5000);
  }, []);

  return (
    <>{isGameStartVisible && <div className="gameStartLogo">Game Start</div>}</>
  );
}
