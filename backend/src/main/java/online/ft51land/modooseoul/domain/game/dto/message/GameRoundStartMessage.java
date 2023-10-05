package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;

import java.util.ArrayList;
import java.util.List;

@Builder
public record GameRoundStartMessage(
		Long currentRound,
		List<String> stockName,
		List<Long> stockPrices,
		List<List<Long>> stockPricesHistory
) {
	public static GameRoundStartMessage of(Game game, List<GameStock> gameStocks) {
		List<String> stockNames = new ArrayList<>();
		List<Long> stockPrices = new ArrayList<>();
		List<List<Long>> stockPricesHistory = new ArrayList<>();
			for (GameStock gameStock : gameStocks) {
			stockPrices.add(gameStock.getStockPrice());
			stockNames.add(gameStock.getStockName());
			stockPricesHistory.add(gameStock.getStockPriceHistory());
		}
		return GameRoundStartMessage
				.builder()
				.currentRound(game.getCurrentRound())
				.stockName(stockNames)
				.stockPrices(stockPrices)
				.stockPricesHistory(stockPricesHistory)
				.build();
	}
}
