package online.ft51land.modooseoul.domain.stock_board.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.game_stock.repository.GameStockRepository;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.domain.stock_board.dto.message.StockBoardMessage;
import online.ft51land.modooseoul.domain.stock_board.dto.request.StockBoardRequestDto;
import online.ft51land.modooseoul.domain.stock_board.service.StockBoardService;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Controller
@AllArgsConstructor
public class StockBoardWebSocketController {

	private final WebSocketSendHandler webSocketSendHandler;

	private final GameStockRepository gameStockRepository;

	private final PlayerService playerService;
	private final GameService gameService;
	private final StockBoardService stockBoardService;

	@MessageMapping("/stock/purchase/{playerId}")
	public void purchaseStock(@Payload StockBoardRequestDto stockBoardRequestDto, @DestinationVariable String playerId) {
		List<GameStock> gameStocks = new ArrayList<>();
		Player player = playerService.getPlayerById(playerId);
		Game game =  gameService.getGameById(player.getGameId());

		for (String gameStockId : game.getGameStockIds()) {
			gameStocks.add(gameStockRepository
					.findById(gameStockId)
					.orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_NOT_FOUND)));
		}
		StockBoardMessage message = stockBoardService.purchaseStock(player, stockBoardRequestDto, gameStocks);

		webSocketSendHandler.sendToPlayer("stock/purchase", player.getId(), game.getId(), message);
	}
}
