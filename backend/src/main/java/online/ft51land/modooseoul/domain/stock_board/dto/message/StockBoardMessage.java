package online.ft51land.modooseoul.domain.stock_board.dto.message;

import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.stock_board.entity.StockBoard;

import java.util.ArrayList;
import java.util.List;

@Builder
@Slf4j
public record StockBoardMessage(
		Long playerStockMoney,
		Long prevStockMoney,
		List<String> stockNames,
		List<Long> purchasePrices,
		List<Long> stockAmounts,
		List<Long> stockPrices
) {
	public static StockBoardMessage of(Player player, StockBoard stockBoard, List<GameStock> gameStocks) {
		List<String> names = new ArrayList<>();
		List<Long> prices = new ArrayList<>();
		for (GameStock gameStock : gameStocks) {
			names.add(gameStock.getStockName());
			prices.add(gameStock.getStockPrice());
		}
		log.info("message = {}", stockBoard.getPrevStockMoney());
		return StockBoardMessage
				.builder()
				.playerStockMoney(player.getStockMoney())
				.prevStockMoney(stockBoard.getPrevStockMoney())
				.stockNames(names)
				.purchasePrices(stockBoard.getAveragePurchases())
				.stockAmounts(stockBoard.getStockAmounts())
				.stockPrices(prices)
				.build();
	}
}
