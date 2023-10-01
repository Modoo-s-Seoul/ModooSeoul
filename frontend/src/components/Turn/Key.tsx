import { useRecoilValue } from "recoil";
import { keyRandomState, tcolState, trowState } from "../../data/IngameData";
import { useEffect, useState } from "react";
import { boardDataState } from "../../data/BoardData";

import CloseBtn from "./CloseBtn";
import KeyCheckThief from "./key/KeyCheckThief";
import KeyLotto from "./key/KeyLotto";
import KeyMoreNews from "./key/KeyMoreNews";
import KeyNothing from "./key/KeyNothing";

import "./Key.css";

export default function Key() {
  // 기본 인자
  const tRow = useRecoilValue(trowState); // 현재 턴 row
  const tCol = useRecoilValue(tcolState); // 현재 턴 col
  const boardData = useRecoilValue(boardDataState); // 보드 데이터
  const [turnData] = useState(boardData[`${tRow}-${tCol}`]); // 턴 데이터
  const keyRandom = useRecoilValue(keyRandomState);
  const [loadKeyBody, setLoadKeyBody] = useState(false);

  // 자동 마운트
  useEffect(() => {
    // 3초 후에 턴 넘김
    setTimeout(() => {
      setLoadKeyBody(true);
    }, 2000);
  }, []);

  return (
    <>
      <div className={"userTurnContainer"}>
        {/* 상단 - 닫기 버튼 */}
        <div className="keyHeader">
          <CloseBtn />
        </div>
        {/* 중단 - 본 내용 */}
        <div className="keyBody">
          <div className="keyTitle">{turnData.name}</div>
          {loadKeyBody && (
            <>
              {keyRandom == "tax" && <KeyCheckThief />}
              {keyRandom == "lotto" && <KeyLotto />}
              {keyRandom == "news" && <KeyMoreNews />}
              {keyRandom == "nothing" && <KeyNothing />}
            </>
          )}
        </div>
      </div>
    </>
  );
}
