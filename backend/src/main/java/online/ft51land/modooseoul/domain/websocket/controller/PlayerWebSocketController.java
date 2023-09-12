package online.ft51land.modooseoul.domain.websocket.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.websocket.service.PlayerWebSocketService;
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
	@MessageMapping("/room/{roomId}") // /send/room/{} 로 오는 것들은 다 여기서 처리됨.
	public void handlePlayerJoin(@Payload PlayerJoinRequestDto playerJoinRequestDto, SimpMessageHeaderAccessor headerAccessor) {
		log.info("메시지 전송 성공");
		String sessionId = headerAccessor.getSessionId();
		playerWebSocketService.handlePlayerJoin(playerJoinRequestDto, sessionId);
	}
}
