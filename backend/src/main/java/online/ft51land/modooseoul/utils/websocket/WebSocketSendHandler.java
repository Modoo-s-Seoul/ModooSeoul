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


	public <T> void sendToGame(String gameId, T message) {
		log.info("gameId = {}, message = {}", gameId, message);
		simpMessagingTemplate.convertAndSend("/receive/game/"+gameId, message);
	}

}
