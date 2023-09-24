import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  tcolState,
  trowState,
  isPrisonState,
  turnState,
  isUserTurnVisibleState,
} from '../../data/IngameData';
import { useEffect, useState } from 'react';
import { boardDataState } from '../../data/BoardData';
import './Prison.css';

/** 감옥칸 */
export default function Prison() {
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const setIsPrison = useSetRecoilState(isPrisonState); // 감옥 반영
  // 시간 제한 인자
  const [timeCnt, setTimeCnt] = useState(5);
  const setTurn = useSetRecoilState(turnState);
  const setUserTurn = useSetRecoilState(isUserTurnVisibleState);

  /** 감옥 여부 반영 */
  useEffect(() => {
    // 실제구현 (감옥반영 요청)

    // 가구현
    setIsPrison(true);
  }, []);

  // 초측정
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCnt > 0) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        // 0초일시 턴 넘기기 (비활성화)
        setUserTurn(false);
        setTurn((prev) => prev + 1);
        /** 감옥 여부 초기화  */
      }
    }, 1000);
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [timeCnt]);

  return (
    <>
      <div className={'userTurnContainer'}>
        {/* 중단 - 본 내용 */}
        <div className="prisonBody">
          <div className="userTurnTitle">{turnData.name}</div>
          <div>이번 라운드 자유행동 금지</div>
        </div>
        {/* 하단 - 기능 버튼 */}
      </div>
    </>
  );
}
