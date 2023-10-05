import IngameModal from "../Base/IngameModal";
import { useState } from "react";
import CloseButton from "../Base/CloseButton";
import StockTrade from "../CommonTurn/Stock/StockTrade";
import NewsCheck from "../CommonTurn/News/NewsCheck";
import GameOption from "../Base/GameOption";
import StockCheck from "../CommonTurn/Stock/StockCheck";

/**컴포넌트 테스트용 컴포넌트 */
export default function TestComponent() {
  const [isTradeVisible, setIsTradeVisible] = useState(false); // 주식 거래

  const openModal = () => {
    setIsTradeVisible((prev) => !prev);
  };

  return (
    <>
      <h1>Test Your Components</h1>
      <button onClick={openModal}>모달 열기</button>
      <GameOption />
      <NewsCheck />
      <StockCheck />
      <IngameModal visible={isTradeVisible}>
        {isTradeVisible && <StockTrade />}
        <div style={{ cursor: "pointer" }}>
          <CloseButton onClick={openModal} />
        </div>
      </IngameModal>
    </>
  );
}
