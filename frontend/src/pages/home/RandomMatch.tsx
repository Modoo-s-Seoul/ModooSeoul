import { useEffect, useState } from 'react';
import BackBtn from '../../components/Base/BackBtn';
import GameRules from '../../data/GameRule.ts';

/** 랜덤매치용 컴포넌트 */
export default function RandomMatch() {
  /** 초세기 */
  const [seconds, setSeconds] = useState(0);
  /** 룰넘버 */
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
      if (seconds % 10 === 9) {
        // 매 10초마다 새로운 룰을 랜덤하게 선택
        const newIndex = Math.floor(Math.random() * GameRules.length);
        setCurrentRuleIndex(newIndex);
      }
    }, 1000);
    // 컴포넌트가 언마운트되면 clearInterval을 호출하여 타이머를 정리합니다.
    return () => {
      clearInterval(intervalId);
    };
  }, [seconds]);
  return (
    <>
      <div className="roomContainer">
        <div className="roomHeader">
          <BackBtn />
        </div>
        <div>
          <h1>랜덤 매칭중입니다...</h1>
          <div>{GameRules[currentRuleIndex].description}</div>
          <p>매칭 시간: {seconds} 초</p>
        </div>
      </div>
    </>
  );
}
