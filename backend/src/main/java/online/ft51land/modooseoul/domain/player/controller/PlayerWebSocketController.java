package online.ft51land.modooseoul.domain.player.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerDiceMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerReadyMessage;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.domain.player.service.PlayerWebSocketSendService;
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
	private final PlayerWebSocketSendService playerWebSocketSendService;
	private final WebSocketSendHandler webSocketSendHandler;


	// 플레이어 레디
	@MessageMapping("/ready/{playerId}")
	public void playerReady(@DestinationVariable String playerId) {
		log.info("레디 메시지 수신 by {}", playerId);

		// 플레이어 레디 상태로 변경
		Player player = playerService.playerReady(playerId);

		// 메시지 생성
		List<PlayerReadyMessage> message = playerWebSocketSendService.sendAllReadyStatusToRoom(player);

		System.out.println(message.toString());
		// 보내기
		webSocketSendHandler.sendToGame(player.getGameId(), message);

	}

	/*
		주사위 굴리기
	 */
	@MessageMapping("/roll/{playerId}")
	public void playerRollDice(@DestinationVariable String playerId) {
		log.info("주사위 굴리기 by {}", playerId);
		Player player = playerService.getPlayerById(playerId);
		// 주사위 굴리고 데이터 처리
		// 넘겨줄 데이터 가공
		PlayerDiceMessage playerDiceMessage = playerService.rollDice(playerId);
		log.info("playerDiceMessage = {}", playerDiceMessage);
		// 데이터 전달
		webSocketSendHandler.sendToGame(player.getGameId(), playerDiceMessage);
	}
}
