package online.ft51land.modooseoul.domain.game.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.service.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@AllArgsConstructor
public class GameWebSocketController {


	private final GameService gameService;

	@MessageMapping("/game-start/{gameId}")
	public void gameStart(@DestinationVariable String gameId){
//		gameService.sendGameStartToRoom(roomService.gameStart(gameId));
	}
	
}
