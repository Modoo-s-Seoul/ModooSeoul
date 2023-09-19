package online.ft51land.modooseoul.domain.player.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.messagenum.service.MessageNumService;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerDiceMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerInfoMessage;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Slf4j
@Controller
@AllArgsConstructor
public class PlayerWebSocketController {

	private final PlayerService playerService;
	private final GameService gameService;
	private final MessageNumService messageNumService;

	private final WebSocketSendHandler webSocketSendHandler;


	/*
		플레이어 참가
	 */
	@MessageMapping("/join/{gameId}")
	public void playerJoin(@DestinationVariable String gameId) {
		log.info("플레이어 참가");

		// 게임 객체 얻어오기
		Game game = gameService.getGameById(gameId);

		// 메시지 가공 후 전송
		webSocketSendHandler.sendToGame("join", gameId,
				messageNumService.getMessageNumByGameId(gameId), playerService.getPlayersInfoForRoom(game));
	}

	// 플레이어 레디
	@MessageMapping("/ready/{playerId}")
	public void playerReady(@DestinationVariable String playerId) {
		log.info("레디 메시지 수신 by {}", playerId);

		// 플레이어 레디 상태로 변경
		Player player = playerService.playerReady(playerId);
		String gameId = player.getGameId();

		// 메시지 생성
		List<PlayerInfoMessage> message = playerService.getPlayersInfoForRoom(gameService.getGameById(gameId));

		// 보내기
		webSocketSendHandler.sendToGame("ready", player.getGameId(),
				messageNumService.getMessageNumByGameId(gameId),message);
	}

	/*
		주사위 굴리기
	 */
	@MessageMapping("/roll/{playerId}")
	public void playerRollDice(@DestinationVariable String playerId) {
		log.info("주사위 굴리기 by {}", playerId);

		Player player = playerService.getPlayerById(playerId);

		// 주사위 굴리고 데이터 가공
		PlayerDiceMessage playerDiceMessage = playerService.rollDice(playerId);

		// 데이터 전달
		webSocketSendHandler.sendToGame("roll", player.getGameId(),
				messageNumService.getMessageNumByGameId(player.getGameId()),playerDiceMessage);
	}
}
