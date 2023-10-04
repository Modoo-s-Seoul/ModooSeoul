import { useEffect, useState } from "react";
import "./intro.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isYourTurnVisibleState,
  whoAreYouState,
} from "../../../data/IngameData";

export default function YourTurn() {
  // 기본 인자
  const [yourTurn, setYourTurn] = useState(0);
  const realTurn = useRecoilValue(whoAreYouState);
  const [isYourTurnVisible, setIsYourTurnVisible] = useRecoilState(
    isYourTurnVisibleState
  ); // 2. 순서정하기

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
    }, 3000);

    // 5초 후에 랜덤한 값을 멈추고 특정 값으로 설정
    setTimeout(() => {
      setIsYourTurnVisible(false);
    }, 6000);

    return () => {
      clearInterval(randomTimer); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, []);

  return (
    <>
      {isYourTurnVisible && (
        <div className="yourTurn">당신의 턴은 {yourTurn + 1}번째 입니다.</div>
      )}
    </>
  );
}
