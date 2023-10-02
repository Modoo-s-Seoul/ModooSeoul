// import React from 'react';
import "./GroundSelectBtn.css";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  buildingChangeState,
  builingInfoState,
  displayPlayerDataState,
  groundChangeState,
  groundMsgNumState,
  isCommonGroundSellActiveState,
  playerDataState,
  scolState,
  srowState,
  whoAreYouState,
} from "../../data/IngameData";
import { useState, useEffect } from "react";
import { boardDataState } from "../../data/BoardData";

export default function GroundSelectBtn() {
  // 기본인자
  const [isCommonGroundSellActive, setIsCGSA] = useRecoilState(
    isCommonGroundSellActiveState
  );
  const [groundMsgNum, setGroundMsgNum] = useRecoilState(groundMsgNumState); // 공통턴 선택 순서
  const sRow = useRecoilValue(srowState); // 선택 장소 row
  const sCol = useRecoilValue(scolState); // 선택 장소 col
  // 플레이어 개인정보
  const whoAreYou = useRecoilValue(whoAreYouState);

  // 데이터
  const [boardData, setBoardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData, setTurnData] = useState(boardData[`${sRow}-${sCol}`]); // 선택 장소 데이터
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 현재 정보
  const setDisplayPlayerData = useSetRecoilState(displayPlayerDataState); // 플레이어 전광판 정보
  const [builingData, setBuildingInfo] = useRecoilState(builingInfoState); // 건물 데이터
  const [, setGroundChange] = useRecoilState(groundChangeState); // 땅 변경정보
  const [, setBuildingChange] = useRecoilState(buildingChangeState); // 건물 변경정보

  /** 땅판매 함수 */
  const sellGround = () => {
    // 보드 데이터 갱신
    const newGroundData = { ...boardData };
    newGroundData[`${sRow}-${sCol}`] = {
      ...newGroundData[`${sRow}-${sCol}`],
      sell: false,
      player: null,
    };
    setBoardData(newGroundData);
    // 땅 변동사항 업데이트
    setGroundChange([{ player: 6, index: turnData.index }]);
    // 땅 팔시 건물도 모두 매각
    const newBuildingData = { ...builingData };
    for (let i = 0; i < 3; i++) {
      newBuildingData[turnData.index * 3 + i] = {
        ...newBuildingData[turnData.index * 3 + i],
        sell: false,
        player: null,
      };
    }
    setBuildingInfo(newBuildingData);
    setBuildingChange([
      { player: 6, index: turnData.index * 3, point: 0, industry: -1 },
      { player: 6, index: turnData.index * 3, point: 1, industry: -1 },
      { player: 6, index: turnData.index * 3, point: 2, industry: -1 },
    ]);
    // // 땅 매각비용 발생
    const newPlayerData = [...playerData];
    newPlayerData[whoAreYou] = {
      ...newPlayerData[whoAreYou],
      money: newPlayerData[whoAreYou].money + turnData.price,
    };
    setPlayerData(newPlayerData);
    setDisplayPlayerData(newPlayerData);
    // // 건물 매각비용 발생
  };

  /** 선택완료시 */
  const toggleSelectGround = () => {
    // 땅 판매
    if (groundMsgNum !== 0) {
      sellGround();
    }

    // 초기화
    setIsCGSA(false);
    setGroundMsgNum(0);
  };

  /** 클릭데이터 반영 */
  useEffect(() => {
    setTurnData(boardData[`${sRow}-${sCol}`]);
  }, [sCol, sRow]);

  return (
    <>
      {isCommonGroundSellActive && (
        <>
          <div className="groundSelectDoneContainer">
            {groundMsgNum == 1 && (
              <div className="groundShowContainer">{turnData.name}</div>
            )}
            <div className="groundSelectText">판매할 땅을 고르세요.</div>
            <div className="groundTimeBar">
              <button
                className="groundSelectDoneBtn"
                onClick={toggleSelectGround}
                style={{ cursor: "pointer" }}
              >
                선택 완료
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
