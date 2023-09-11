package online.ft51land.modooseoul.domain.room.service;

import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RoomWebSocketService {

	public void handlePlayerJoin(PlayerJoinRequestDto playerJoinRequestDto) {
		/**
		 * 플레이어 정보가 넘어오면 처리해야 하는 로직
		 * 레디스에 해당 정보를 저장해야함
		 */
		log.info("sessionId: {}", String.valueOf(playerJoinRequestDto.SessionId()));
		log.info("nickname: {}", playerJoinRequestDto.nickName());
		log.info("roomnumber: {}", playerJoinRequestDto.roomNumber());
	}
}
