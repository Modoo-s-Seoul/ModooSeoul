// import React from 'react';
import "./NotMyTurn.css";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  doublePrisonState,
  isCommonTurnVisibleState,
  isModalMsgActiveState,
  isUserTurnVisibleState,
  modalMsgState,
  pNumState,
  turnState,
} from "../../data/IngameData";
import { useEffect } from "react";
import MessageModal from "./MessageModal";

/** 본인 턴이 아닐때 보이는 메세지입니다 */
export default function NotMyTurn() {
  // 기본인자
  const turn = useRecoilValue(turnState); // 현재 플레이 순서
  const pNum = useRecoilValue(pNumState); // 현재 플레이 순서
  const [doublePrison, setDoublePrison] = useRecoilState(doublePrisonState);
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 메세지 모달 토글
  const isUserTurnVisible = useRecoilValue(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const isCommonTurnVisible = useRecoilValue(isCommonTurnVisibleState); // 공통 턴 수행 가능 여부

  // 출력용 플레이어 턴 매칭
  const turnMatch = [];
  for (let i = 0; i < pNum; i++) {
    turnMatch.push(`Player ${i + 1}의 턴입니다`);
  }
  // 출력용 공통턴 매칭
  turnMatch.push("자유 거래시간입니다.");
  // 출력용 뉴스 매칭
  turnMatch.push("원하는 뉴스를 고르세요.");

  // 각종 텍스트 모달 공지
  useEffect(() => {
    if (doublePrison == true) {
      setModalMsg("더블 3회! 감옥이동");
      setIsModalMsgActive(true);
      setDoublePrison(false);
    }
  }, [doublePrison]);

  return (
    <>
      <div className="notMyTurnContainer">
        <div className="notMyTurnText">{turnMatch[turn]}</div>
        {!isUserTurnVisible && !isCommonTurnVisible && <MessageModal />}
      </div>
    </>
  );
}
