import "./StockTrade.css";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { stockChangeType } from "../../../interface/ingame";
import { stockState, stockLabelState } from "../../../data/IngameData";

import Chart from "./Chart";
import Back from "/assets/Back.svg";
import CustomButton from "../../Base/CustomButton";

export default function StockTrade() {
  const [toggleContainer, setToggleContainer] = useState(true); // 모달창 페이지 컨트롤
  const [toggleTrade, setToggleTrade] = useState(true); // 매수/매도창 컨트롤
  const stocks = useRecoilValue(stockState);
  const stockLabel = useRecoilValue(stockLabelState);
  const [currentStock, setCurrentStock] = useState<stockChangeType>();

  /*모달창 페이지 움직이기 */
  const handleContainer = (stockInfo?: stockChangeType) => {
    if (toggleContainer) {
      setCurrentStock(stockInfo);
    }
    setToggleContainer((prev) => !prev);
  };

  /*거래창 페이지 움직이기 */
  const handleTrade = () => {
    setToggleTrade((prev) => !prev);
  };

  return (
    <>
      <div className="stockContainer">
        <div className="stockWindow">
          <div
            className="stockInnerPage"
            style={{
              transform: `${
                toggleContainer ? "translate(0,0)" : "translate(-50%,0)"
              }`,
            }}
          >
            {/*종목 선택 칸 */}
            <div className="selectStock">
              <div className="modalBaseTitle">종목 선택</div>
              <div className="modalBaseBody">
                {stocks.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="modalBaseButton"
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
              <img
                className="backButton"
                src={Back}
                alt="뒤로가기"
                style={{ cursor: "pointer" }}
                onClick={() => handleContainer()}
              ></img>
              <div className="modalBaseTitle">{currentStock?.stockName}</div>
              <div className="modalBaseBody">
                <Chart
                  stockPrice={currentStock?.stockHistory}
                  stockLabels={stockLabel}
                />
                <div className="stockTradeBox">
                  <div className="tradeButtonContainer">
                    <div
                      className={`buyButton ${
                        toggleTrade ? "buyButtonActive" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTrade()}
                    >
                      매수
                    </div>
                    <div
                      className={`sellButton ${
                        !toggleTrade ? "sellButtonActive" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTrade()}
                    >
                      매도
                    </div>
                  </div>
                  <div className="stockTradeWindow">
                    <div
                      className="stockTradePage"
                      style={{
                        transform: `${
                          toggleTrade ? "translate(0,0)" : "translate(-50%,0)"
                        }`,
                      }}
                    >
                      <div className="buyStock">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <div className="inputContainer">
                            <input className="stockInput" type="number"></input>
                            <span className="bar"></span>
                          </div>
                          주
                        </div>
                        <div style={{ marginTop: "5%" }}>
                          <CustomButton
                            baseColor="#848484"
                            hoverColor="#ff0e0e"
                            text="사자"
                            fontsize={30}
                          />
                        </div>
                      </div>
                      <div className="sellStock">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <div className="inputContainer">
                            <input className="stockInput" type="number"></input>
                            <span className="bar"></span>
                          </div>
                          주
                        </div>
                        <div style={{ marginTop: "5%" }}>
                          <CustomButton
                            baseColor="#848484"
                            hoverColor="#1d33ff"
                            text="팔자"
                            fontsize={30}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
