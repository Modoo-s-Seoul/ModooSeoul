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
        <div>
          <div>자산 정보</div>
          <div>이번 라운드에서 받은 배당금:{dividend}</div>
          <div>현재 보유 주식 가치:{stockInfo.playerStockMoney}</div>
          <div>
            이전 라운드 대비{" "}
            {prevStockMoney === 0
              ? 0
              : (playerStockMoney - prevStockMoney) / prevStockMoney}
            %
          </div>
          {stockNames.map((stock, index) => (
            <div>
              <div>{stock}</div>
              <div>{stockAmounts[index]}</div>
              <div>{stockPrices[index]}</div>
              <div>
                {stockPrices[index] - purchasePrices[index]}원{" "}
                {(stockPrices[index] - purchasePrices[index]) /
                  purchasePrices[index]}
                %
              </div>
            </div>
          ))}
        </div>
      </IngameModal>
    </>
  );
}
