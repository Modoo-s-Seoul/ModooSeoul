import { useRecoilState, useRecoilValue } from "recoil";
import {
  pNumState,
  playerDataState,
  playerInfoState,
} from "../../../data/IngameData";
import { useState } from "react";

import CustomButton from "../../Base/CustomButton";
import { useSocket } from "../../../pages/SocketContext";
import { sendWsMessage } from "../../IngameWs/IngameSendFunction";

/** Key - 탈세여부 확인 */
export default function KeyCheckThief() {
  // 기본 인자
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmit, setIsSubmit] = useState(false); // 제출 여부
  const [thiefTrue, setThiefTrue] = useState(false);
  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보
  // 데이터 보관
  const playerData = useRecoilValue(playerDataState);

  /** 선택한 태그를 업데이트하는 함수 */
  const handleClick = (tag: number) => {
    if (selected === tag) {
      // 이미 선택된 태그를 다시 클릭하면 선택 해제
      setSelected(null);
    } else {
      // 새로운 태그를 클릭하면 선택
      setSelected(tag);
    }
  };

  /** 제출 버튼을 클릭했을 때 실행되는 함수 */
  const handleSubmit = () => {
    if (selected !== null) {
      // 탈세범 여부 받아오기
      setThiefTrue(true);
      // 로드 태그 스위치
      setIsSubmit(true);
      // 3초 후에 턴 넘김
      setTimeout(() => {
        sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
      }, 3000);
    } else {
      // 고른 사람이 없을시
      console.log("태그를 선택하세요.");
    }
  };

  return (
    <>
      <div className="innerKeyContainer">
        <div className="innerKeyTitle">탈세범 확인</div>
        <div className="innerKeyBody">
          {/* 탈세 추측범 지목 */}
          {!isSubmit && (
            <>
              <div>탈세 혐의가 의심되는 플레이어를 지목하세요</div>
              <div className="keyThiefContanier">
                {Array.from({ length: pNum }, (_, index) => (
                  <div
                    key={index}
                    className={`keyThief ${
                      selected === index ? "keySelectedThief" : ""
                    }`}
                    onClick={() => handleClick(index)}
                  >
                    {playerData[index].name}
                  </div>
                ))}
              </div>
              <div onClick={handleSubmit}>
                <CustomButton
                  fontsize={21}
                  width={120}
                  height={50}
                  text="탈세여부 확인"
                />
              </div>
            </>
          )}
          {/* 지목시 결과 */}
          {isSubmit && selected != null && (
            <>
              <div className="keyThiefResult">
                <div>{playerData[selected].name}</div>
                <div>탈세범 : {thiefTrue ? "O" : "X"}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
