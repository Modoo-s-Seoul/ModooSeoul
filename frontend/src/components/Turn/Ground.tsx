import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  buildingChangeState,
  builingInfoState,
  doubleCntState,
  groundChangeState,
  isModalMsgActiveState,
  isUserTurnVisibleState,
  matchPosition,
  modalMsgState,
  oilLandState,
  playerDataState,
  tcolState,
  trowState,
  turnState,
} from "../../data/IngameData";
import ClickBtn from "../Base/CustomButton";
import { boardDataState } from "../../data/BoardData";
import { useEffect, useState } from "react";
import "./Ground.css";
import CloseBtn from "./CloseBtn";
import TimeBar from "../Base/TimeBar";
import MessageModal from "../Base/MessageModal";

export default function Ground() {
  // 자체 인자
  const [, setIsUserTurnVisible] = useRecoilState(isUserTurnVisibleState); // 플레이어 턴 수행 가능 여부
  const [selectIndustry, setSelectIndustry] = useState(false); // 산업군 선택 토글
  const [selectedNodes, setSelectedNodes] = useState(-1); // 선택된 건물의 인덱스
  const [, setCntBuilding] = useState(0); // 선택된 건물의 인덱스를 저장하는 배열

  // 기본 인자
  const [buildWhere, setBuildWhere] = useState(0); // 부지 위치
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const doubleCnt = useRecoilValue(doubleCntState); // 더블 카운트
  const [turn, setTurn] = useRecoilState(turnState); // 현재 플레이 순서
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 현재 정보
  const matchPos = useRecoilValue(matchPosition);
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 메세지 모달 토글

  // 데이터
  const [boardData, setBoardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const [builingData, setBuildingInfo] = useRecoilState(builingInfoState); // 건물 데이터
  const [, setGroundChange] = useRecoilState(groundChangeState); // 땅 변경정보
  const [, setBuildingChange] = useRecoilState(buildingChangeState); // 건물 변경정보
  const oilLand = useRecoilValue(oilLandState); // 오일랜드 위치

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
      money: newPlayerData[turn].money - turnData.price,
    };
    setPlayerData(newPlayerData);

    // 턴 종료
    // setIsUserTurnVisible(false);
  };

  /** 땅판매 */
  const sellGround = () => {
    // 보드 데이터 갱신
    const newGroundData = { ...boardData };
    newGroundData[`${tRow}-${tCol}`] = {
      ...newGroundData[`${tRow}-${tCol}`],
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
    newPlayerData[turn] = {
      ...newPlayerData[turn],
      money: newPlayerData[turn].money + turnData.price,
    };
    setPlayerData(newPlayerData);
    // // 건물 매각비용 발생

    // 턴 종료
    setSelectIndustry(false);
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
  const buyBuilding = (num: number) => {
    // 건물 데이터 갱신
    const newData = { ...builingData };
    newData[turnData.index * 3 + num] = {
      ...newData[turnData.index * 3 + num],
      sell: true,
      player: turn,
      industry: selectedNodes,
    };
    setBuildingInfo(newData);
    // 건물 변동 사항 업데이트
    setBuildingChange([
      {
        player: turn,
        index: turnData.index * 3,
        point: num,
        industry: selectedNodes,
      },
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
    setBuildingChange([
      { player: 6, index: turnData.index * 3, point: num, industry: -1 },
    ]);
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
        let cost = turnData.cost;
        if (oilLand !== -1) {
          const row = matchPos[oilLand].row;
          const col = matchPos[oilLand].col;
          if (tRow == row && tCol == col) {
            // 오일랜드 반영
            const newCost = cost * 2;
            cost = newCost;
          }
        }

        console.log(givePlayer, "가", takePlayer, "에게", cost);

        const newPlayerData = { ...playerData };
        if (givePlayer in newPlayerData) {
          // 통행료를 받는 플레이어
          newPlayerData[givePlayer] = {
            ...newPlayerData[givePlayer],
            money: newPlayerData[givePlayer].money - cost,
          };
        }
        if (takePlayer && takePlayer in newPlayerData) {
          // 통행료를 지불하는 플레이어
          newPlayerData[takePlayer] = {
            ...newPlayerData[takePlayer],
            money: newPlayerData[takePlayer].money + cost,
          };
        }

        setPlayerData(newPlayerData);
        setIsUserTurnVisible(!isUserTurnVisibleState);
        if (doubleCnt == 0) {
          setTurn(turn + 1);
        }
      }
    }
  }, [isUserTurnVisibleState]);

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <CloseBtn />
          <TimeBar duration={10} />
        </div>
        {/* 중단 - 본 내용 */}
        <div className="groundBody">
          <div className="groundTitle">{turnData.name}</div>
          {/* <div>구매 : 턴 종료 / 판매 : 자유롭게 </div> */}
          {boardData[`${tRow}-${tCol}`].sell && <div>시너지 효과 : 없음</div>}
          {!selectIndustry && (
            <>
              <div className="groundSelectContainer">
                {boardData[`${tRow}-${tCol}`].sell == false && (
                  <>
                    <div className="groundSelectBox">
                      <div>땅</div>
                      <div> {turnData.price}원</div>
                    </div>
                  </>
                )}
                {boardData[`${tRow}-${tCol}`].sell == true && (
                  <>
                    <div className="groundSelectBox">
                      <div>부지 1</div>
                      {builingData[turnData.index * 3 + 0].sell && (
                        <div>
                          산업 : {builingData[turnData.index * 3 + 0].industry}
                        </div>
                      )}
                      {!builingData[turnData.index * 3 + 0].sell && (
                        <div
                          onClick={() => {
                            setSelectIndustry(true);
                            setBuildWhere(0);
                            // buyBuilding(0);
                          }}
                        >
                          <ClickBtn
                            height={30}
                            width={60}
                            fontsize={18}
                            text={"건물 짓기"}
                          />
                        </div>
                      )}
                      {builingData[turnData.index * 3 + 0].sell && (
                        <div onClick={() => sellBuilding(0)}>
                          <ClickBtn
                            height={30}
                            width={50}
                            fontsize={18}
                            text={"판매"}
                          />
                        </div>
                      )}
                    </div>
                    <div className="groundSelectBox">
                      <div>부지 2</div>
                      {builingData[turnData.index * 3 + 1].sell && (
                        <div>
                          산업 : {builingData[turnData.index * 3 + 1].industry}
                        </div>
                      )}
                      {!builingData[turnData.index * 3 + 1].sell && (
                        <div
                          onClick={() => {
                            setSelectIndustry(true);
                            setBuildWhere(1);
                            // buyBuilding(1);
                          }}
                        >
                          <ClickBtn
                            height={30}
                            width={60}
                            fontsize={18}
                            text={"건물 짓기"}
                          />
                        </div>
                      )}
                      {builingData[turnData.index * 3 + 1].sell && (
                        <div onClick={() => sellBuilding(1)}>
                          <ClickBtn
                            height={30}
                            width={50}
                            fontsize={18}
                            text={"판매"}
                          />
                        </div>
                      )}
                    </div>
                    <div className="groundSelectBox">
                      <div>부지 3</div>
                      {builingData[turnData.index * 3 + 2].sell && (
                        <div>
                          산업 : {builingData[turnData.index * 3 + 2].industry}
                        </div>
                      )}
                      {!builingData[turnData.index * 3 + 2].sell && (
                        <div
                          onClick={() => {
                            setSelectIndustry(true);
                            setBuildWhere(2);
                            // buyBuilding(2);
                          }}
                        >
                          <ClickBtn
                            height={30}
                            width={60}
                            fontsize={18}
                            text={"건물 짓기"}
                          />
                        </div>
                      )}
                      {builingData[turnData.index * 3 + 2].sell && (
                        <div onClick={() => sellBuilding(2)}>
                          <ClickBtn
                            height={30}
                            width={50}
                            fontsize={18}
                            text={"판매"}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {selectIndustry && (
            <>
              <div className="industryBtn">
                <div
                  onClick={() => {
                    setSelectedNodes(-1);
                    setSelectIndustry(false);
                  }}
                >
                  ↜뒤로가기
                </div>
              </div>
              <div className="buildingBuyContainer">
                {["교육", "교통", "유통", "주거", "문화"].map(
                  (label, index) => (
                    <div
                      key={index}
                      className={`buildingBuyBox ${
                        selectedNodes == index ? "buyActive" : ""
                      }`}
                      onClick={() => handleNodeClick(index)}
                    >
                      {label}
                    </div>
                  )
                )}
              </div>
            </>
          )}
          <div>예상 통행료 : {turnData.cost}원</div>
        </div>
        {/* 하단 - 기능 버튼 */}
        {boardData[`${tRow}-${tCol}`].sell == false && (
          <>
            <div className="groundBtnContainer">
              <div onClick={buyGround}>
                <ClickBtn
                  height={50}
                  width={150}
                  fontsize={30}
                  text={"땅 구매"}
                />
              </div>
            </div>
          </>
        )}
        {boardData[`${tRow}-${tCol}`].sell == true && (
          <>
            <div className="groundBtnContainer">
              <div onClick={sellGround}>
                <ClickBtn
                  height={50}
                  width={120}
                  fontsize={25}
                  text={"땅 판매"}
                />
              </div>
              {selectIndustry && (
                <>
                  <MessageModal />
                  <div
                    onClick={() => {
                      if (selectedNodes == -1) {
                        setModalMsg("산업군을 지정해주세요");
                        setIsModalMsgActive(true);
                        return;
                      }
                      buyBuilding(buildWhere);
                    }}
                  >
                    <ClickBtn
                      height={50}
                      width={120}
                      fontsize={25}
                      text={"건물 구매"}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
