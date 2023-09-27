import { useEffect, useState } from "react";
import ClickBtn from "../Base/CustomButton";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  buildingChangeState,
  builingInfoState,
  isStartActiveState,
  scolState,
  srowState,
  startMsgNumState,
  turnState,
} from "../../data/IngameData";
import "./Start.css";
import { boardDataState } from "../../data/BoardData";
import { AlertModal } from "../Base/AlertModal";
import { alertModalState } from "../../data/CommonData";

export default function StartSelectBtn() {
  // 기본인자
  const sRow = useRecoilValue(srowState); // 선택 장소 row
  const sCol = useRecoilValue(scolState); // 선택 장소 col
  const [turn, setTurn] = useRecoilState(turnState); // 현재 플레이 순서
  const [isStartActive, setIsStartActive] = useRecoilState(isStartActiveState); // 오일 토글(board에서 감지)
  const [msgNum, setMsgNum] = useRecoilState(startMsgNumState); // 시작점 선택 순서
  const [selectedNodes, setSelectedNodes] = useState(-1); // 선택된 건물의 인덱스
  const [buildWhere, setBuildWhere] = useState(0); // 부지 위치
  const [alertVisible, setAlertVisible] = useRecoilState(alertModalState);

  // 데이터
  const [boardData] = useRecoilState(boardDataState); // 보드 데이터
  const [turnData, setTurnData] = useState(boardData[`${sRow}-${sCol}`]); // 선택 장소 데이터
  const [builingData, setBuildingInfo] = useRecoilState(builingInfoState); // 건물 데이터
  const [, setBuildingChange] = useRecoilState(buildingChangeState); // 건물 변경정보

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
  };

  /** 선택완료시 */
  const toggleSelectStart = () => {
    // 에러문구 띄우기
    if (msgNum < 2) {
      setAlertVisible(true);
    } else if (msgNum == 2) {
      buyBuilding(buildWhere);
      setIsStartActive(false);
      setTurn(turn + 1);
      setMsgNum(0);
      // 실제구현 - 턴변경 요청
    }
  };

  /** 건물 카드 클릭시 */
  const handleNodeClick = (index: number) => {
    if (selectedNodes == index) {
      setSelectedNodes(-1);
      return;
    }
    setSelectedNodes(index);
  };

  /** 시간초과시 */
  useEffect(() => {
    // 플레이어 턴일시
    if (isStartActive) {
      const rollTimeout = setTimeout(() => {
        // 가구현
        // setTurn(turn + 1);
        // setMsgNum(0);
        // 실제 구현 - 턴 변경 요청
      }, 10000);
      if (!isStartActive) {
        clearTimeout(rollTimeout);
      }
      return () => {
        if (rollTimeout) {
          clearTimeout(rollTimeout);
        }
      };
    }
  }, [turn, isStartActive]);

  /** 클릭데이터 반영 */
  useEffect(() => {
    setTurnData(boardData[`${sRow}-${sCol}`]);
  }, [sCol, sRow]);

  return (
    <>
      {alertVisible && <AlertModal text="건설을 완료해주세요" />}
      {isStartActive && (
        <>
          <div className="startSelectDoneContainer">
            {/* 선택 구현 */}
            {msgNum !== 0 && (
              <div className="startShowContainer">
                <div>{turnData.name}</div>
                {msgNum == 1 && (
                  <>
                    <div className="groundSelectContainer">
                      <div className="groundSelectBox">
                        <div>부지 1</div>
                        {builingData[turnData.index * 3 + 0].sell && (
                          <div>
                            산업 :{" "}
                            {builingData[turnData.index * 3 + 0].industry}
                          </div>
                        )}
                        {!builingData[turnData.index * 3 + 0].sell && (
                          <div
                            onClick={() => {
                              setMsgNum(2);
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
                      <div className="groundSelectBox">
                        <div>부지 2</div>
                        {builingData[turnData.index * 3 + 1].sell && (
                          <div>
                            산업 :{" "}
                            {builingData[turnData.index * 3 + 1].industry}
                          </div>
                        )}
                        {!builingData[turnData.index * 3 + 1].sell && (
                          <div
                            onClick={() => {
                              setMsgNum(2);
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
                      <div className="groundSelectBox">
                        <div>부지 3</div>
                        {builingData[turnData.index * 3 + 2].sell && (
                          <div>
                            산업 :{" "}
                            {builingData[turnData.index * 3 + 2].industry}
                          </div>
                        )}
                        {!builingData[turnData.index * 3 + 2].sell && (
                          <div
                            onClick={() => {
                              setMsgNum(2);
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
                {msgNum == 2 && (
                  <>
                    <div className="startIndustryContainer">
                      <div className="industryBtn">
                        <div
                          onClick={() => {
                            setSelectedNodes(-1);
                            setMsgNum(1);
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
                    </div>
                  </>
                )}
              </div>
            )}
            {/* 텍스트 */}
            <div className="startSelectText">
              {msgNum == 0 && `건설할 칸을 고르세요`}
              {msgNum == 1 && `건설할 부지를 고르세요`}
              {msgNum == 2 && `건설할 산업을 고르세요`}
            </div>
            {/* 완료 버튼 */}
            <div className="startTimeBar">
              <button
                className="startSelectDoneBtn"
                onClick={toggleSelectStart}
                style={{ cursor: "pointer" }}
              >
                건설 완료
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
