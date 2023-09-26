import { useState } from "react";
import {
  selectedNewsState,
  isNewsVisibleState,
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
        <div className="newsPageContainer">
          <h1>이번 라운드에서 선택된 뉴스</h1>
          <div className="newsCardContainer">
            <h2>{selectedNews}</h2>
          </div>
          <div>뉴스 확인 버튼을 다시 누르면 창이 닫힙니다.</div>
        </div>
      </IngameModal>
    </>
  );
}
