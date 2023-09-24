// import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isCommonTurnVisibleState,
  roundState,
  turnState,
} from '../../data/IngameData';

export default function CloseBtn() {
  const [, setIsCommonTurnVisible] = useRecoilState(isCommonTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const [, setTurn] = useRecoilState(turnState); // 턴 데이터
  const setRound = useSetRecoilState(roundState); // 라운드 정보

  return (
    <>
      <button
        onClick={() => {
          setIsCommonTurnVisible(false);
          setTurn((prev) => prev + 1);
          setRound((prev) => prev + 1);
        }}
        className="closeUserTurn"
        style={{ cursor: 'pointer' }}
      >
        공통턴 창 닫기
      </button>
    </>
  );
}
