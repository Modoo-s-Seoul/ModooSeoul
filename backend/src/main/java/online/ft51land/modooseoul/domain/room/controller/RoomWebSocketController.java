package online.ft51land.modooseoul.domain.room.controller;

import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.room.service.RoomWebSocketService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Slf4j
public class RoomWebSocketController {

	private final RoomWebSocketService roomWebSocketService;

	public RoomWebSocketController(RoomWebSocketService roomWebSocketService) {
		this.roomWebSocketService = roomWebSocketService;
	}

	// 방 입장 시 해줘야하는 로직
	@MessageMapping("/1") // URI 바꿔야함.
	public void handlePlayerJoin(@Payload PlayerJoinRequestDto playerJoinRequestDto, SimpMessageHeaderAccessor headerAccessor) {
		log.info("소켓 연결 성공");
		String sessionId = headerAccessor.getSessionId();
		roomWebSocketService.handlePlayerJoin(playerJoinRequestDto, sessionId);
	}
}
