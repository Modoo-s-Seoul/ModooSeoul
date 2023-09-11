package online.ft51land.modooseoul.domain.room.controller;

import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.room.service.RoomWebSocketService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;

public class RoomWebSocketController {

	private final RoomWebSocketService roomWebSocketService;

	public RoomWebSocketController(RoomWebSocketService roomWebSocketService) {
		this.roomWebSocketService = roomWebSocketService;
	}

	// 방 입장 시 해줘야하는 로직
	@MessageMapping("/") // URI 바꿔야함.
	public void handlePlayerJoin(@Payload PlayerJoinRequestDto playerJoinRequestDto) {
		roomWebSocketService.handlePlayerJoin(playerJoinRequestDto);
	}
}
