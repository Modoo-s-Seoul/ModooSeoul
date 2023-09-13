import { SpaceInfo } from "../../interface/ingame";
import { useRecoilState } from "recoil";
import { isUserTurnVisibleState } from "../../data/IngameData";

interface Props {
  turnData: SpaceInfo;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Prison({ turnData }: Props) {
  const [isUserTurnVisible, setIsUserTurnVisible] = useRecoilState(
    isUserTurnVisibleState
  ); // 플레이어 턴 수행 가능 여부
  isUserTurnVisible;
  return (
    <>
      <div className={"prison"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <button
            onClick={() => setIsUserTurnVisible(false)}
            className="closeUserTurn"
          >
            ✖
          </button>
        </div>
        {/* 중단 - 본 내용 */}
        <div>
          <div>감옥</div>
        </div>
        {/* 하단 - 기능 버튼 */}
      </div>
    </>
  );
}
