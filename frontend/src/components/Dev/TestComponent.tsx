import IngameModal from "../Base/IngameModal";
import CommonTurn from "../CommonTurn/CommonTurn";

import { isCommonTurnVisibleState } from "../../data/IngameData";
import { useRecoilState } from "recoil";

/**컴포넌트 테스트용 컴포넌트 */
export default function TestComponent() {
  const [isCommonTurnVisible, setIsCommonTurnVisible] = useRecoilState(
    isCommonTurnVisibleState
  );

  const openModal = () => {
    setIsCommonTurnVisible((prev) => !prev);
  };

  return (
    <>
      <h1>Test Your Components</h1>
      <button onClick={openModal}>모달 열기</button>
      <IngameModal visible={isCommonTurnVisible}>
        {isCommonTurnVisible && <CommonTurn />}
      </IngameModal>
    </>
  );
}
