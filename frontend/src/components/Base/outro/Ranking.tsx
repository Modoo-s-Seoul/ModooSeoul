import { useEffect } from "react";
import "./outro.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isRankingVisibleState,
  rankingDataState,
} from "../../../data/IngameData";
import ClickBtn from "../../Base/CustomButton";
import { useNavigate } from "react-router-dom";

export default function Ranking() {
  // 기본 인자
  const rankingData = useRecoilValue(rankingDataState);
  const [isRankingvisible, setIsRankingvisible] = useRecoilState(
    isRankingVisibleState
  ); // 랭킹 컴포넌트 토글
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후에 랜덤한 값을 멈추고 특정 값으로 설정
    setTimeout(() => {
      setIsRankingvisible(true);
    }, 5000);
  }, []);

  return (
    <>
      {isRankingvisible && (
        <div className="rankingContainer">
          <div className="rankingInnerContainer">
            <div className="rankingTitle">순위표</div>
            <div className="rankingBox">
              {rankingData.length >= 1 && (
                <>
                  <div className={`rankingRow ranking1`}>
                    <div>🥇 1위 {rankingData[0].nickname}</div>
                  </div>
                  <div className={`rankingRow ranking2`}>
                    🥈 2위 {rankingData[1].nickname}
                  </div>
                  {rankingData.length >= 3 && (
                    <>
                      <div className={`rankingRow ranking3`}>
                        🥉 3위 {rankingData[2].nickname}
                      </div>
                    </>
                  )}
                  {rankingData.length == 4 && (
                    <>
                      <div className={`rankingRow ranking4`}>
                        4위 {rankingData[3].nickname}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="rankingFooter">
              <div
                onClick={() => {
                  navigate(`/home`);
                }}
              >
                <ClickBtn
                  width={200}
                  height={80}
                  fontsize={30}
                  text={"나가기"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
