package online.ft51land.modooseoul.domain.room.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.room.service.RoomService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@AllArgsConstructor
public class RoomWebSocketController {


	private final RoomService roomService;

	@MessageMapping("/game-start/{roomId}")
	public void gameStart(@DestinationVariable String roomId){
//		roomService.sendGameStartToRoom(roomService.gameStart(roomId));
	}
	
}
