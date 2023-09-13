package online.ft51land.modooseoul.websocket.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@AllArgsConstructor
public class PlayerWebSocketController {


	private final PlayerService playerService;


	/*
	플레이어 세션 아이디 저장
	 */
	@MessageMapping("/connection")
	public void connectPlayer(SimpMessageHeaderAccessor headerAccessor) {
		log.info("메시지 전송 성공");
		String sessionId = headerAccessor.getSessionId();
//		playerService.registPlayer(sessionId);
	}
}
