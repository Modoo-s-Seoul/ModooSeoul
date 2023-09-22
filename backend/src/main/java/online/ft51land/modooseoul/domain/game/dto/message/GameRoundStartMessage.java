package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;

import java.util.ArrayList;
import java.util.List;

@Builder
public record GameRoundStartMessage(
		Long currentRound,
		List<Long> stockPrices
) {
	public static GameRoundStartMessage of(Game game, List<GameStock> gameStocks) {
		List<Long> stockPrices = new ArrayList<>();
		for (GameStock gameStock : gameStocks) {
			stockPrices.add(gameStock.getStocksPrice());
		}
		return GameRoundStartMessage
				.builder()
				.currentRound(game.getCurrentRound())
				.stockPrices(stockPrices)
				.build();
	}
}
