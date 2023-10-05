import { useState } from "react";
import { useRecoilValue } from "recoil";
import IngameModal from "../../Base/IngameModal";
import "./StockCheck.css";
import StockIcon from "/assets/stock.svg";
import CloseButton from "../../Base/CloseButton";
import { dividendState, playerStockInfoState } from "../../../data/IngameData";

/**현재 플레이어의 금융 정보 확인용 버튼 */
export default function StockCheck() {
  const [isStockCheckVisible, setIsStockCheckVisible] = useState(false);
  const dividend = useRecoilValue(dividendState);
  const stockInfo = useRecoilValue(playerStockInfoState);
  const {
    playerStockMoney,
    prevStockMoney,
    stockNames,
    purchasePrices,
    stockAmounts,
    stockPrices,
  } = stockInfo;

  const toggleStockCheck = () => {
    setIsStockCheckVisible(!isStockCheckVisible);
  };

  return (
    <>
      <div
        className="stockCheckBtn"
        style={{ cursor: "pointer" }}
        onClick={toggleStockCheck}
      >
        <img src={StockIcon} alt="news" width="80%" height="80%" />
      </div>

      <IngameModal visible={isStockCheckVisible}>
        <CloseButton onClick={toggleStockCheck} />
        <div className="modalBaseContainer">
          <div className="modalBaseTitle">자산 정보</div>
          <div className="modalBaseBody">
            <div style={{ width: "100%", fontSize: "30px" }}>
              이번 라운드에서 받은 배당금: {dividend} 원
            </div>
            <div style={{ width: "100%", fontSize: "30px" }}>
              현재 보유 주식 가치:{stockInfo.playerStockMoney} 원
              <div style={{ fontSize: "20px" }}>
                이전 라운드 대비{" "}
                <span
                  style={{
                    color: `${
                      playerStockMoney > prevStockMoney ? "red" : "blue"
                    }`,
                  }}
                >
                  {prevStockMoney === 0
                    ? 0
                    : ((playerStockMoney - prevStockMoney) / prevStockMoney) *
                      100}
                  %
                </span>
              </div>
            </div>
            {stockNames.map((stock, index) => (
              <div className="stockInfoBox" key={index}>
                <div style={{ fontWeight: "bold" }}>
                  {stock}
                  <div style={{ fontSize: "20px" }}>
                    {stockAmounts[index]} 주
                  </div>
                </div>
                <div>
                  {stockAmounts[index] * purchasePrices[index]} 원
                  <div
                    style={{
                      color: `${
                        stockPrices[index] > purchasePrices[index]
                          ? "red"
                          : "blue"
                      }`,
                      fontSize: "20px",
                    }}
                  >
                    {stockPrices[index] > purchasePrices[index] ? "+" : ""}
                    {(stockPrices[index] - purchasePrices[index]) *
                      stockAmounts[index]}{" "}
                    원 (
                    {stockAmounts[index] === 0
                      ? 0
                      : ((stockPrices[index] - purchasePrices[index]) /
                          purchasePrices[index]) *
                        100}
                    %)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IngameModal>
    </>
  );
}
