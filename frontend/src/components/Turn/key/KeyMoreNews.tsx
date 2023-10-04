import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { moreNewsState, turnState } from "../../../data/IngameData";

/** Key - 뉴스 더 제공받기 */
export default function KeyMoreNews() {
  // 기본 인자
  const [turn, setTurn] = useRecoilState(turnState); // 턴 정보
  const moreNews = useRecoilValue(moreNewsState); // 추가 뉴스 정보

  // 자동 언마운트
  useEffect(() => {
    // 뉴스 내용받아오기

    // 3초 후에 턴 넘김
    setTimeout(() => {
      setTurn(turn + 1);
    }, 3000);
  }, []);

  return (
    <>
      <div className="innerKeyContainer">
        <div className="innerKeyTitle">추가 뉴스</div>
        <div className="innerKeyBody">
          <div className="keyNewsResult">{moreNews}</div>
        </div>
      </div>
    </>
  );
}
