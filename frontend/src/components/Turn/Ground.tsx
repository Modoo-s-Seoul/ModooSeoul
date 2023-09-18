import { useRecoilState, useRecoilValue } from "recoil";
import {
  builingInfoState,
  doubleCntState,
  groundChangeState,
  isUserTurnVisibleState,
  pNumState,
  playerDataState,
  tcolState,
  trowState,
  turnState,
} from "../../data/IngameData";
import ClickBtn from "../Base/ClickBtn";
import { boardDataState } from "../../data/BoardData";
import { useEffect, useState } from "react";
import "./Ground.css";

export default function Ground() {
  const [, setIsUserTurnVisible] = useRecoilState(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const doubleCnt = useRecoilValue(doubleCntState); // 현재 턴 row
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const turn = useRecoilValue(turnState); // 현재 턴 col
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 현재 정보
  const [boardData, setBoardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const [, setBuildingInfo] = useRecoilState(builingInfoState); // 건물 데이터
  const [, setGroundChange] = useRecoilState(groundChangeState); // 땅 변경정보
  const [selectedNodes, setSelectedNodes] = useState(-1); // 선택된 건물의 인덱스를 저장하는 배열

  /** 땅 구매 */
  const buyGround = () => {
    // 플레이어 측정
    let player;
    if (doubleCnt) {
      player = turn;
    } else {
      player = (turn + 3) % pNum;
    }
    // 보드 데이터 갱신
    const newData = { ...boardData };
    newData[`${tRow}-${tCol}`] = {
      ...newData[`${tRow}-${tCol}`],
      sell: true,
      player: player,
    };
    setBoardData(newData);
    // 땅 변동사항 업데이트
    setGroundChange([{ player: player, index: turnData.index }]);
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
    // 플레이어 측정
    let player;
    if (doubleCnt) {
      player = turn;
    } else {
      player = (turn + 3) % pNum;
    }
    player;
    // 건물 데이터 갱신
    setBuildingInfo;
  };

  /** 통행료 지불 */
  useEffect(() => {
    // 플레이어 측정
    let player;
    if (doubleCnt) {
      player = turn;
    } else {
      player = (turn + 3) % pNum;
    }

    if (isUserTurnVisibleState) {
      // 이미 구매한땅일시
      console.log("이미구매");
      const givePlayer = player;
      const takePlayer = turnData.player;
      if (turnData.sell && turnData.player !== player) {
        // 통행료 지불
        console.log(playerData);
        const cost = turnData.cost;
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
      }
    }
  }, [isUserTurnVisibleState]);

  return (
    <>
      <div className={"ground"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <button
            onClick={() => setIsUserTurnVisible(false)}
            className="closeUserTurn"
            style={{ cursor: "pointer" }}
          >
            ✖
          </button>
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
            <div onClick={buyBuilding}>
              <ClickBtn
                height={50}
                width={180}
                fontsize={30}
                text={"건물 구매"}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
