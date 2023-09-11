package online.ft51land.modooseoul.domain.room.service;

import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RoomWebSocketService {

	private final SimpMessagingTemplate simpMessagingTemplate;

	public RoomWebSocketService (SimpMessagingTemplate simpMessagingTemplate) {
		this.simpMessagingTemplate = simpMessagingTemplate;
	}

	public void handlePlayerJoin(PlayerJoinRequestDto playerJoinRequestDto, String sessionId) {
		/**
		 * 플레이어 정보가 넘어오면 처리해야 하는 로직
		 * 레디스에 해당 정보를 저장해야함
		 */
		log.info("sessionId: {}", sessionId);
		log.info("nickname: {}", playerJoinRequestDto.nickname());
		log.info("roomnumber: {}", playerJoinRequestDto.roomNumber());

		simpMessagingTemplate.convertAndSend("/receive", playerJoinRequestDto);
	}
}
