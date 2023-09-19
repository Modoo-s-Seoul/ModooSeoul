import { useRecoilState, useRecoilValue } from "recoil";
import {
  buildingChangeState,
  builingInfoState,
  groundChangeState,
  isUserTurnVisibleState,
  playerDataState,
  tcolState,
  trowState,
  turnState,
} from "../../data/IngameData";
import ClickBtn from "../Base/ClickBtn";
import { boardDataState } from "../../data/BoardData";
import { useEffect, useState } from "react";
import "./Ground.css";
import CloseBtn from "./CloseBtn";

export default function Ground() {
  const [, setIsUserTurnVisible] = useRecoilState(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const [turn, setTurn] = useRecoilState(turnState); // 현재 플레이 순서
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 현재 정보
  const [boardData, setBoardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const [builingData, setBuildingInfo] = useRecoilState(builingInfoState); // 건물 데이터
  const [, setGroundChange] = useRecoilState(groundChangeState); // 땅 변경정보
  const [, setBuildingChange] = useRecoilState(buildingChangeState); // 건물 변경정보
  const [selectedNodes, setSelectedNodes] = useState(-1); // 선택된 건물의 인덱스
  const [cntBuilding, setCntBuilding] = useState(0); // 선택된 건물의 인덱스를 저장하는 배열

  /** 건물 갯수 세기 */
  useEffect(() => {
    let contB = 0;
    for (let i = 0; i < 3; i++) {
      if (builingData[turnData.index * 3 + i].sell == true) {
        contB = contB + 1;
      }
    }
    setCntBuilding(contB);
  }, [builingData]);

  /** 땅 구매 */
  const buyGround = () => {
    // 보드 데이터 갱신
    const newData = { ...boardData };
    newData[`${tRow}-${tCol}`] = {
      ...newData[`${tRow}-${tCol}`],
      sell: true,
      player: turn,
    };
    setBoardData(newData);
    // 땅 변동사항 업데이트
    setGroundChange([{ player: turn, index: turnData.index }]);
    // 땅 구매비용 발생
    const newPlayerData = [...playerData];
    newPlayerData[turn] = {
      ...newPlayerData[turn],
      money: newPlayerData[turn].money - turnData.cost,
    };
    setPlayerData(newPlayerData);

    // 턴 종료
    // setIsUserTurnVisible(false);
  };

  /** 땅판매 */
  const sellGround = () => {
    // 보드 데이터 갱신
    const newData = { ...boardData };
    newData[`${tRow}-${tCol}`] = {
      ...newData[`${tRow}-${tCol}`],
      sell: false,
      player: null,
    };
    setBoardData(newData);
    // 땅 변동사항 업데이트
    setGroundChange([{ player: 6, index: turnData.index }]);
    // 땅 팔시 건물도 모두 매각

    // // 땅 매각비용 발생
    const newPlayerData = [...playerData];
    newPlayerData[turn] = {
      ...newPlayerData[turn],
      money: newPlayerData[turn].money + turnData.cost,
    };
    setPlayerData(newPlayerData);
    // // 건물 매각비용 발생

    // 턴 종료
    // setIsUserTurnVisible(false);
  };

  /** 건물 카드 클릭시 */
  const handleNodeClick = (index: number) => {
    if (selectedNodes == index) {
      setSelectedNodes(-1);
      return;
    }
    setSelectedNodes(index);
  };

  /** 건물 구매 */
  const buyBuilding = () => {
    // 건물 데이터 갱신
    // // 1. 지을수 있는 건물 위치 파악
    let buildPoint = 0;
    for (let i = 0; i < 3; i++) {
      if (builingData[turnData.index * 3 + buildPoint].sell == false) {
        break;
      } else {
        buildPoint = i;
      }
    }
    // // 2. 해당위치 건물 데이터 변경
    const newData = { ...builingData };
    newData[turnData.index * 3 + buildPoint] = {
      ...newData[turnData.index * 3 + buildPoint],
      sell: true,
      player: turn,
    };
    setBuildingInfo(newData);
    // 건물 변동 사항 업데이트
    setBuildingChange([
      { player: turn, index: turnData.index * 3, point: buildPoint },
    ]);
    // 건물 건설 비용 발생

    // 턴 종료
    // setIsUserTurnVisible(false);
  };

  /** 건물 판매 */
  const sellBuilding = (num: number) => {
    // 건물 데이터 갱신
    const newData = { ...builingData };
    newData[turnData.index * 3 + num] = {
      ...newData[turnData.index * 3 + num],
      sell: false,
      player: null,
    };
    setBuildingInfo(newData);
    // 건물 변동 사항 업데이트
    setBuildingChange([{ player: 6, index: turnData.index * 3, point: num }]);
    // 턴 종료
    // setIsUserTurnVisible(false);
  };

  /** 통행료 지불 */
  useEffect(() => {
    if (isUserTurnVisibleState) {
      // 이미 구매한땅일시
      const givePlayer = turn;
      const takePlayer = turnData.player;
      if (turnData.sell && turnData.player !== turn) {
        // 통행료 지불
        const cost = turnData.cost;
        console.log(givePlayer, "가", takePlayer, "에게", cost);
        const newPlayerData = playerData.map((playerInfo, index) => {
          if (index === givePlayer) {
            // 통행료를 받는 플레이어
            return { ...playerInfo, money: playerInfo.money - cost };
          } else if (index === takePlayer) {
            // 통행료를 지불하는 플레이어
            return { ...playerInfo, money: playerInfo.money + cost };
          } else {
            return playerInfo;
          }
        });
        setPlayerData(newPlayerData);
        setIsUserTurnVisible(!isUserTurnVisibleState);
        setTurn(turn + 1);
      }
    }
  }, [isUserTurnVisibleState]);

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <CloseBtn />
          <div className="timeBar"></div>
        </div>
        {/* 중단 - 본 내용 */}
        <div className="userturnBody">
          <div>위치 : {turnData.name}</div>
          <div>가격 : {turnData.price}</div>
          <div>통행료 : {turnData.cost}</div>
        </div>
        {/* 하단 - 기능 버튼 */}
        {boardData[`${tRow}-${tCol}`].sell == false && (
          <div onClick={buyGround}>
            <ClickBtn height={50} width={180} fontsize={30} text={"땅 구매"} />
          </div>
        )}
        {boardData[`${tRow}-${tCol}`].sell == true && (
          <>
            <div className="buildingBuyContainer">
              {["교육", "교통", "유통", "주거", "문화"].map((label, index) => (
                <div
                  key={index}
                  className={`buildingBuyBox ${
                    selectedNodes == index ? "buyActive" : ""
                  }`}
                  onClick={() => handleNodeClick(index)}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="groundBtnContainer">
              <div onClick={sellGround}>
                <ClickBtn
                  height={50}
                  width={120}
                  fontsize={25}
                  text={"땅 판매"}
                />
              </div>
              {cntBuilding !== 0 && (
                <div onClick={() => sellBuilding(0)}>
                  <ClickBtn
                    height={50}
                    width={120}
                    fontsize={25}
                    text={"건물 판매"}
                  />
                </div>
              )}

              {cntBuilding !== 3 && (
                <div onClick={buyBuilding}>
                  <ClickBtn
                    height={50}
                    width={180}
                    fontsize={30}
                    text={"건물 구매"}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
