package online.ft51land.modooseoul.domain.stock_board.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.game_stock.service.GameStockService;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.domain.stock_board.dto.message.StockBoardMessage;
import online.ft51land.modooseoul.domain.stock_board.dto.request.StockBoardRequestDto;
import online.ft51land.modooseoul.domain.stock_board.service.StockBoardService;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.List;

@Slf4j
@Controller
@AllArgsConstructor
public class StockBoardWebSocketController {

	private final WebSocketSendHandler webSocketSendHandler;

	private final PlayerService playerService;
	private final GameService gameService;
	private final StockBoardService stockBoardService;
	private final GameStockService gameStockService;

	@MessageMapping("/stock/purchase/{playerId}")
	public void purchaseStock(@Payload StockBoardRequestDto dto, @DestinationVariable String playerId) {
		Player player = playerService.getPlayerById(playerId);
		Game game =  gameService.getGameById(player.getGameId());
		List<GameStock> gameStocks = gameStockService.getGameStockById(game);

		StockBoardMessage message = stockBoardService.purchaseStock(player, dto, gameStocks);

		webSocketSendHandler.sendToPlayer("stock/purchase", playerId, game.getId(), message);
	}

	@MessageMapping("/stock/sell/{playerId}")
	public void sellStock(@Payload StockBoardRequestDto dto, @DestinationVariable String playerId) {
		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());
		List<GameStock> gameStocks = gameStockService.getGameStockById(game);

		StockBoardMessage message = stockBoardService.sellStock(player, dto, gameStocks);

		webSocketSendHandler.sendToPlayer("stock/sell", playerId, game.getId(), message);
	}

	@MessageMapping("/stock/info/{playerId}")
	public void getStockInfo(@DestinationVariable String playerId) {
		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());

		List<GameStock> gameStocks = gameStockService.getGameStockById(game);

		StockBoardMessage message = stockBoardService.getStockInfo(player, gameStocks);

		webSocketSendHandler.sendToPlayer("stock/info", playerId, game.getId(), message);
	}

}
