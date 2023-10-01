import { useState } from "react";
import {
  selectedNewsState,
  isNewsVisibleState,
  moreNewsState,
} from "../../../data/IngameData";
import IngameModal from "../../Base/IngameModal";
import "./NewsCheckBtn.css";
import { useRecoilValue } from "recoil";

/**현재 라운드에서 주어진 뉴스 확인용 버튼 */
export default function NewsCheck() {
  const [isNewsCheckVisible, setIsNewsCheckVisible] = useState(false);
  const toggleNewsCheck = () => {
    setIsNewsCheckVisible(!isNewsCheckVisible);
  };

  const selectedNews = useRecoilValue(selectedNewsState);
  const isNewsVisible = useRecoilValue(isNewsVisibleState);
  const moreNews = useRecoilValue(moreNewsState); // 추가 뉴스 정보

  return (
    <>
      {!isNewsVisible && (
        <div
          className={`newsCheckBtn ${isNewsVisible ? "" : "showSelectedNews"}`}
          style={{ cursor: "pointer" }}
          onClick={toggleNewsCheck}
        >
          뉴스 확인
        </div>
      )}

      <IngameModal
        width="60vw"
        height="30vh"
        maxWidth="600px"
        visible={isNewsCheckVisible}
      >
        <div className="newsCheckOuterContainer">
          <div className="modalClose">
            <div onClick={toggleNewsCheck} style={{ cursor: "pointer" }}>
              ✖
            </div>
          </div>
          {/* <div className="newsCheckTitle">이번 라운드에서 선택된 뉴스</div> */}
          <div className="newsCheckContainer">
            <div className="newsCheckItems">{selectedNews}</div>
            {moreNews !== "" && (
              <div className="newsCheckItems">{moreNews}</div>
            )}
          </div>
          {/* <div>뉴스 확인 버튼을 다시 누르면 창이 닫힙니다.</div> */}
        </div>
      </IngameModal>
    </>
  );
}
