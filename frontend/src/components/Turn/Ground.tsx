import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  builingInfoState,
  displayPlayerDataState,
  isModalMsgActiveState,
  isUserTurnVisibleState,
  modalMsgState,
  playerDataState,
  playerInfoState,
  tcolState,
  trowState,
  turnState,
  whoAreYouState,
} from "../../data/IngameData";
import ClickBtn from "../Base/CustomButton";
import { boardDataState } from "../../data/BoardData";
import { useEffect, useState } from "react";
import "./Ground.css";
import CloseBtn from "./CloseBtn";
import TimeBar from "../Base/TimeBar";
import MessageModal from "../Base/MessageModal";
import { useSocket } from "../../pages/SocketContext";
import { sendWsMessage } from "../IngameWs/IngameSendFunction";

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
  const [turn] = useRecoilState(turnState); // 현재 플레이 순서
  const [playerData] = useRecoilState(playerDataState); // 플레이어 현재 정보
  const setDisplayPlayerData = useSetRecoilState(displayPlayerDataState); // 플레이어 전광판 정보
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 메세지 모달 토글

  // 데이터
  const [boardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData, setTurnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const [builingData] = useRecoilState(builingInfoState); // 건물 데이터

  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  // 플레이어 정보
  const whoAreyou = useRecoilValue(whoAreYouState);

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
    // 실제구현
    sendWsMessage(socketClient, playerInfo.playerId, "send/purchase/ground");
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
    // 실제 구현
    sendWsMessage(
      socketClient,
      playerInfo.playerId,
      "send/purchase/building",
      `{"boardIdx":${turnData.order}, "buildingIdx": ${
        num + 1
      } , "buildingId": ${selectedNodes + 1} }`
    );

    // 턴 종료
    setIsUserTurnVisible(false);
  };

  /** 통행료 지불 */
  useEffect(() => {
    if (isUserTurnVisibleState) {
      // 이미 구매한땅일시
      console.log(turnData.sell, turnData, "턴데이터 통행료");
      if (turnData.sell && turnData.player !== turn) {
        // 통행료 지불
        setDisplayPlayerData(playerData);
        console.log("통행료를 지불하고 턴을 넘깁니다.");
        setIsUserTurnVisible(!isUserTurnVisibleState);
      }
    }
  }, [isUserTurnVisibleState]);

  // 타이머 관련
  useEffect(() => {
    // 타이머 요청 (본인 턴일때만 요청)
    if (turn == whoAreyou) {
      sendWsMessage(
        socketClient,
        playerInfo.gameId,
        `send/timer`,
        `{"timerType":"ESTATE_PURCHASE"}`
      );
      // 언마운트시 타이머 해제
      return () => {
        sendWsMessage(socketClient, playerInfo.playerId, "send/timer-cancel");
      };
    }
  }, []);

  /** 시간초과시 */
  useEffect(() => {
    // 플레이어 턴일시
    if (isUserTurnVisibleState) {
      const rollTimeout = setTimeout(() => {
        setIsUserTurnVisible(false);
      }, 30000);
      if (!isUserTurnVisibleState) {
        clearTimeout(rollTimeout);
      }
      return () => {
        if (rollTimeout) {
          clearTimeout(rollTimeout);
          sendWsMessage(socketClient, playerInfo.playerId, "send/timer-cancel");
        }
      };
    }
  }, [isUserTurnVisibleState]);

  // 턴데이터 갱신
  useEffect(() => {
    setTurnData(boardData[`${tRow}-${tCol}`]);
  }, [tCol, tRow]);

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <CloseBtn />
          <TimeBar duration={30} />
        </div>
        {/* 중단 - 본 내용 */}
        <div className="groundBody">
          {/* <div>구매 : 턴 종료 / 판매 : 자유롭게 </div> */}
          {boardData[`${tRow}-${tCol}`].sell && (
            <div className="effectTitle">시너지 효과 : 없음</div>
          )}
          {!selectIndustry && (
            <>
              <div className="groundSelectContainer">
                {boardData[`${tRow}-${tCol}`].sell == false && (
                  <>
                    <div className="groundSelectBox">
                      <div className="groundTitle">{turnData.name}</div>
                      <div>땅값</div>
                      <div> {turnData.price}원</div>
                    </div>
                  </>
                )}
                {boardData[`${tRow}-${tCol}`].sell == true && (
                  <>
                    <div className="groundThreeContainer">
                      <div className="groundThreeBox">
                        {builingData[turnData.index * 3 + 0].sell && (
                          <div>
                            산업 :{" "}
                            {builingData[turnData.index * 3 + 0].industry}
                          </div>
                        )}
                        {!builingData[turnData.index * 3 + 0].sell && (
                          <div
                            onClick={() => {
                              setSelectIndustry(true);
                              setBuildWhere(0);
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
                      </div>
                      <div className="groundThreeBox">
                        {builingData[turnData.index * 3 + 1].sell && (
                          <div>
                            산업 :{" "}
                            {builingData[turnData.index * 3 + 1].industry}
                          </div>
                        )}
                        {!builingData[turnData.index * 3 + 1].sell && (
                          <div
                            onClick={() => {
                              setSelectIndustry(true);
                              setBuildWhere(1);
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
                      </div>
                      <div className="groundThreeBox">
                        {builingData[turnData.index * 3 + 2].sell && (
                          <div>
                            산업 :{" "}
                            {builingData[turnData.index * 3 + 2].industry}
                          </div>
                        )}
                        {!builingData[turnData.index * 3 + 2].sell && (
                          <div
                            onClick={() => {
                              setSelectIndustry(true);
                              setBuildWhere(2);
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
                      </div>
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
                  style={{ cursor: "pointer" }}
                  className="backBtnBuildingBuy"
                >
                  ↩
                </div>
              </div>
              <div className="buildingBuyContainer">
                {["교통", "교육", "유통", "주거", "문화"].map(
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
