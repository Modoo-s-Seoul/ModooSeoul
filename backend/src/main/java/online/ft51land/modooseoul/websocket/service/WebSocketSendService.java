package online.ft51land.modooseoul.websocket.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketSendService {

	private SimpMessagingTemplate simpMessagingTemplate;

	public <T> void sendToRoom(String roomId, T message) {
		simpMessagingTemplate.convertAndSend("receive/"+roomId, message);
	}
}
