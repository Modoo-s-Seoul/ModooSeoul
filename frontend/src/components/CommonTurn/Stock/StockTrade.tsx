import { useState } from "react";
import "./StockTrade.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import CloseButton from "../../Base/CloseButton";
import { isCommonTurnVisibleState } from "../../../data/IngameData";
import { stockChangeType } from "../../../interface/ingame";
import { stockState } from "../../../data/IngameData";

export default function StockTrade() {
  const [toggleContainer, setToggleContainer] = useState(true);
  const setIsCommonTurnVisible = useSetRecoilState(isCommonTurnVisibleState);
  const stocks = useRecoilValue(stockState);
  const [currentStock, setCurrentStock] = useState<stockChangeType>();

  const handleContainer = (stockInfo?: stockChangeType) => {
    if (toggleContainer) {
      setCurrentStock(stockInfo);
    }
    setToggleContainer((prev) => !prev);
  };

  const closeModal = () => {
    setIsCommonTurnVisible((prev) => !prev);
  };

  return (
    <>
      <div className="stockContainer">
        <div className="stockWindow">
          <div
            className="stockTradeContainer"
            style={{
              transform: `${
                toggleContainer ? "translate(0,0)" : "translate(-50%,0)"
              }`,
            }}
          >
            {/*종목 선택 칸 */}
            <div className="selectStock">
              <CloseButton onClick={closeModal}></CloseButton>
              <div className="stockContainerTitle">종목 선택</div>
              <div className="stockSelectContainer">
                {stocks.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="stockButton"
                      onClick={() => handleContainer(ele)}
                      style={{ cursor: "pointer" }}
                    >
                      {ele.stockName}
                    </div>
                  );
                })}
              </div>
            </div>
            {/*주식 거래 칸 */}
            <div className="stockTrade">
              <div className="stockContainerTitle">
                {currentStock?.stockName}
              </div>
              <div onClick={() => handleContainer()}>hi</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
