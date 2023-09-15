import { useRecoilState } from "recoil";
import { isUserTurnVisibleState } from "../../data/IngameData";
import { SpaceInfo } from "../../interface/ingame";

interface Props {
  turnData: SpaceInfo;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Key({ turnData }: Props) {
  const [isUserTurnVisible, setIsUserTurnVisible] = useRecoilState(
    isUserTurnVisibleState
  ); // 플레이어 턴 수행 가능 여부
  isUserTurnVisible;
  return (
    <>
      <div className={"key"}>
        {/* 상단 - 닫기 버튼 */}
        <div>
          <button
            onClick={() => setIsUserTurnVisible(false)}
            className="closeUserTurn"
            style={{ cursor: "pointer" }}
          >
            ✖
          </button>
        </div>
        {/* 중단 - 본 내용 */}
        <div>
          <div>황금열쇠</div>
        </div>
        {/* 하단 - 기능 버튼 */}
      </div>
    </>
  );
}
