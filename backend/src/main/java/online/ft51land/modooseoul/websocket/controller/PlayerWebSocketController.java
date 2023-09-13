package online.ft51land.modooseoul.websocket.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@AllArgsConstructor
public class PlayerWebSocketController {


	private final PlayerService playerService;

	/*
		플레이어 레디
	*/
	@MessageMapping("/ready/{playerId}")
	public void playerReady(@DestinationVariable String playerId) {
		log.info("레디 메시지 수신 by {}", playerId);
		playerService.sendAllReadyStatusToRoom(playerService.playerReady(playerId));
	}
}
