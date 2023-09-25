import IngameModal from "../Base/IngameModal";
import StockTrade from "../CommonTurn/Stock/StockTrade";

import { isCommonTurnVisibleState } from "../../data/IngameData";
import { useRecoilState } from "recoil";

/**컴포넌트 테스트용 컴포넌트 */
export default function TestComponent() {
  const [isCommonTurn, setIsCommonTurn] = useRecoilState(
    isCommonTurnVisibleState
  );

  const openModal = () => {
    setIsCommonTurn((prev) => !prev);
  };

  return (
    <>
      <h1>Test Your Components</h1>
      <button onClick={openModal}>모달 열기</button>
      <IngameModal visible={isCommonTurn}>
        <StockTrade></StockTrade>
      </IngameModal>
    </>
  );
}
