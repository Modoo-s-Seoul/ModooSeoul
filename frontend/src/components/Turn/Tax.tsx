import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  dirtyMoneyState,
  isUserTurnVisibleState,
  playerDataState,
  turnState,
} from "../../data/IngameData";
import "./Tax.css";

export default function Tax() {
  // 기본인자
  const turn = useRecoilValue(turnState);
  const [dirtyMoney, setDirtyMoney] = useRecoilState(dirtyMoneyState);
  // 데이터 보관
  const [playerData, setPlayerData] = useRecoilState(playerDataState);
  // 시간 제한 인자
  const [timeCnt, setTimeCnt] = useState(3);
  const setTurn = useSetRecoilState(turnState);
  const setUserTurn = useSetRecoilState(isUserTurnVisibleState);

  /** 초측정 */
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

  /** 탈세 검증 */
  useEffect(() => {
    // 기본 세팅
    const newPlayerData = [...playerData];
    // 세금 징수 or 위로금 지급
    if (turn in newPlayerData) {
      if (dirtyMoney) {
        newPlayerData[turn] = {
          ...newPlayerData[turn],
          money: newPlayerData[turn].money - dirtyMoney * 3,
        };
      } else {
        newPlayerData[turn] = {
          ...newPlayerData[turn],
          money: newPlayerData[turn].money + 500000,
        };
      }
    }
    setPlayerData(newPlayerData);
    setDirtyMoney(0);

    // 실제구현 - send 요청
  }, []);

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 중단 - 본 내용 */}
        <div className="taxBody">
          <div className="userTurnTitle">국세청</div>
          <div>세무조사를 실시합니다.</div>
          <div>※ 탈세 적발시 미납추징금 3배 부과 ※</div>
          <div>※ 모범 납세자에게는 50만원의 위로금 지급 ※</div>
        </div>
        {/* 하단 - 기능 버튼 */}
      </div>
    </>
  );
}
