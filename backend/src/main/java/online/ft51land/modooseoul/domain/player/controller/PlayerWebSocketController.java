package online.ft51land.modooseoul.domain.player.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.player.service.PlayerWebSocketService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@AllArgsConstructor
public class PlayerWebSocketController {

	private final PlayerWebSocketService playerWebSocketService;

	// 방 입장 시 해줘야하는 로직
	@MessageMapping("/1") // URI 바꿔야함.
	public void handlePlayerJoin(@Payload PlayerJoinRequestDto playerJoinRequestDto, SimpMessageHeaderAccessor headerAccessor) {
		log.info("메시지 전송 성공");
		String sessionId = headerAccessor.getSessionId();
		playerWebSocketService.handlePlayerJoin(playerJoinRequestDto, sessionId);
	}
}
