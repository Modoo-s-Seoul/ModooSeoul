import "./StockTrade.css";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useSocket } from "../../../pages/SocketContext";
import { playerInfoState } from "../../../data/IngameData";

import { stockChangeType } from "../../../interface/ingame";
import { stockState, stockLabelState } from "../../../data/IngameData";

import Chart from "./Chart";
import Back from "/assets/Back.svg";
import CustomButton from "../../Base/CustomButton";
import { sendWsMessage } from "../../IngameWs/IngameSendFunction";

export default function StockTrade() {
  const socketClient = useSocket();
  const playerInfo = useRecoilValue(playerInfoState);
  const [toggleContainer, setToggleContainer] = useState(true); // 모달창 페이지 컨트롤
  const [toggleTrade, setToggleTrade] = useState(true); // 매수/매도창 컨트롤
  const stocks = useRecoilValue(stockState);
  const stockLabel = useRecoilValue(stockLabelState);
  const [currentStock, setCurrentStock] = useState<stockChangeType>();
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);

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

  /** 주식 매수 */
  const buyStock = () => {
    sendWsMessage(
      socketClient,
      playerInfo.playerId,
      `send/stock/purchase`,
      `{"stockName":"${currentStock?.stockName}","stockAmount":${buyAmount}}`
    );
  };

  /** 주식 매도 */
  const sellStock = () => {
    sendWsMessage(
      socketClient,
      playerInfo.playerId,
      `send/stock/sell`,
      `{"stockName":"${currentStock?.stockName}","stockAmount":${sellAmount}}`
    );
  };

  const isHigh = () => {
    if (currentStock) {
      if (currentStock.stockHistory.length === 1) {
        return 0;
      } else if (
        currentStock?.currentPrice >
        currentStock?.stockHistory[currentStock?.stockHistory.length - 2]
      ) {
        return 1;
      } else if (
        currentStock?.currentPrice <
        currentStock?.stockHistory[currentStock?.stockHistory.length - 2]
      ) {
        return -1;
      } else {
        return 0;
      }
    }
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
                <div className="stockInfoContainer">
                  <div className="chart">
                    <Chart
                      stockPrice={currentStock?.stockHistory}
                      stockLabels={stockLabel}
                    />
                  </div>
                  <div className="stockPriceBox">
                    <div className="priceTitle">현재 주가</div>
                    <div
                      style={{
                        color: `${
                          isHigh() === 0
                            ? "black"
                            : isHigh() === 1
                            ? "red"
                            : "blue"
                        }`,
                      }}
                    >
                      {isHigh() === 0 ? "" : isHigh() === 1 ? "▲" : "▼"}
                      {currentStock?.currentPrice}
                    </div>
                  </div>
                </div>
                <div className="stockTradeBox">
                  <div className="tradeButtonContainer">
                    <div
                      className={`buyButton ${
                        toggleTrade ? "buyButtonActive" : ""
                      }`}
                      style={{
                        cursor: `${toggleTrade ? "none" : "pointer"}`,
                      }}
                      onClick={toggleTrade ? undefined : () => handleTrade()}
                    >
                      매수
                    </div>
                    <div
                      className={`sellButton ${
                        !toggleTrade ? "sellButtonActive" : ""
                      }`}
                      style={{
                        cursor: `${!toggleTrade ? "none" : "pointer"}`,
                      }}
                      onClick={!toggleTrade ? undefined : () => handleTrade()}
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
                            fontSize: "30px",
                          }}
                        >
                          <div className="inputContainer">
                            <input
                              className="stockInput"
                              type="number"
                              onChange={(e) =>
                                setBuyAmount(Number(e.target.value))
                              }
                            ></input>
                            <span className="bar"></span>
                          </div>
                          주
                        </div>
                        <div style={{ marginTop: "5%" }}>
                          <div onClick={buyStock}>
                            <CustomButton
                              baseColor="#848484"
                              hoverColor="#ff0e0e"
                              text="사자"
                              fontsize={25}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="sellStock">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "30px",
                          }}
                        >
                          <div className="inputContainer">
                            <input
                              className="stockInput"
                              type="number"
                              onChange={(e) =>
                                setSellAmount(Number(e.target.value))
                              }
                            ></input>
                            <span className="bar"></span>
                          </div>
                          주
                        </div>
                        <div style={{ marginTop: "5%" }}>
                          <div onClick={sellStock}>
                            <CustomButton
                              baseColor="#848484"
                              hoverColor="#1d33ff"
                              text="팔자"
                              fontsize={25}
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
      </div>
    </>
  );
}
