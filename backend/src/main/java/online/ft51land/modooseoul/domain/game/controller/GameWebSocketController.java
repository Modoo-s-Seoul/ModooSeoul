package online.ft51land.modooseoul.domain.game.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.message.GameRoundStartMessage;
import online.ft51land.modooseoul.domain.game.dto.message.GameStartMessage;
import online.ft51land.modooseoul.domain.game.dto.message.GameTurnMessage;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.messagenum.service.MessageNumService;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerInGameInfoMessage;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Controller
@AllArgsConstructor
public class GameWebSocketController {

	private final GameService gameService;
	private final PlayerService playerService;
	private final MessageNumService messageNumService;
	private final WebSocketSendHandler webSocketSendHandler;

	@MessageMapping("/start/{gameId}")
	public void gameStart(@DestinationVariable String gameId) {
		Game game = gameService.getGameById(gameId);
		List<Player> players = new ArrayList<>();
		for (String playerId : game.getPlayers()) {
			players.add(playerService.getPlayerById(playerId));
		}

		// 게임 시작 가능 여부 반환
		GameStartMessage gameStartMessage = gameService.gameStart(game, players);

		// 메시지 번호 가지고 오기 게임 시작 가능한지 여부 전송
		webSocketSendHandler.sendToGame("start", gameId, gameStartMessage);

	}

	// 현재 턴 정보
	@MessageMapping("/turn/{gameId}")
	public void getTurnInfo(@DestinationVariable String gameId) {
		Game game = gameService.getGameById(gameId);

		webSocketSendHandler.sendToGame("turn", gameId, GameTurnMessage.of(game));
	}


	// 턴 종료
	@MessageMapping("pass/{gameId}")
	public void passTurn(@DestinationVariable String gameId ){
		Game game = gameService.getGameById(gameId);
		gameService.passTurn(game);
		webSocketSendHandler.sendToGame("pass", gameId, GameTurnMessage.of(game));
	}

	@MessageMapping("/playersInfo/{gameId}")
	public void getPlayersInfo(@DestinationVariable String gameId) {
		Game game = gameService.getGameById(gameId);
		List<Player> players = new ArrayList<>();

		for (String playerId : game.getPlayers()) {
			players.add(playerService.getPlayerById(playerId));
		}

		List<PlayerInGameInfoMessage> message = gameService.getPlayersInfo(players);

		webSocketSendHandler.sendToGame("playersInfo", gameId, message);
	}

	@MessageMapping("/roundStart/{gameId}")
	public void startRound(@DestinationVariable String gameId) {
		// game 객체 생성
		Game game = gameService.getGameById(gameId);

//		// 예외 처리
//		if (game.getTurnInfo() != game.getPlayers().size()) {
//			throw new BusinessException(ErrorMessage.INTERVAL_SERVER_ERROR);
//		}

		GameRoundStartMessage message = gameService.startRound(game);

		webSocketSendHandler.sendToGame("roundStart", gameId, message);

	}
}