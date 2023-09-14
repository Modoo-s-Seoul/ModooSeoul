package online.ft51land.modooseoul.utils.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
public class WebSocketSendHandler {

	private final SimpMessagingTemplate simpMessagingTemplate;


	public <T> void sendToRoom(String roomId, T message) {
		log.info("roomId = {}, message = {}", roomId, message);
		simpMessagingTemplate.convertAndSend("/receive/room/"+roomId, message);
	}

}
