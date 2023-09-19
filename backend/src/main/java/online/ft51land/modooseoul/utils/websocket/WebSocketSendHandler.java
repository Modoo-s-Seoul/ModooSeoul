package online.ft51land.modooseoul.utils.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.utils.dto.message.BaseMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
public class WebSocketSendHandler {

	private final SimpMessagingTemplate simpMessagingTemplate;

	public <T> void sendToGame(String topic, String gameId,Long messageNum, T message) {
		log.info("gameId = {}, message = {}", gameId, message);

		simpMessagingTemplate.convertAndSend("/receive/game/"+ topic +"/"+gameId, BaseMessage.baseMessage(messageNum, message));
	}

}
