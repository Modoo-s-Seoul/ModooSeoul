package online.ft51land.modooseoul.websocket.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketSendService {

	private final SimpMessagingTemplate simpMessagingTemplate;

	public <T> void sendToRoom(String roomId, T message) {
		log.info("roomId = {}", roomId);
		simpMessagingTemplate.convertAndSend("/receive/room/"+roomId, message);
	}
}
