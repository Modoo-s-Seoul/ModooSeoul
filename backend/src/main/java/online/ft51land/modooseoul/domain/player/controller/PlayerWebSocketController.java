package online.ft51land.modooseoul.domain.player.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerDiceMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerPrisonMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerReadyInfoMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerNewsMessage;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerNewsRequestDto;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.List;

@Slf4j
@Controller
@AllArgsConstructor
public class PlayerWebSocketController {

	private final PlayerService playerService;
	private final GameService gameService;

	private final WebSocketSendHandler webSocketSendHandler;



	// 플레이어 참가
	@MessageMapping("/join/{gameId}")
	public void playerJoin(@DestinationVariable String gameId) {
		log.info("플레이어 참가");

		// 게임 객체 얻어오기
		Game game = gameService.getGameById(gameId);

		// 메시지 가공 후 전송
		webSocketSendHandler.sendToGame("join", gameId, playerService.getPlayersInfoForRoom(game));
	}

	// 플레이어 레디
	@MessageMapping("/ready/{playerId}")
	public void playerReady(@DestinationVariable String playerId) {
		log.info("레디 메시지 수신 by {}", playerId);

		// 플레이어 레디 상태로 변경
		Player player = playerService.playerReady(playerId);
		String gameId = player.getGameId();

		// 메시지 생성
		List<PlayerReadyInfoMessage> message = playerService.getPlayersInfoForRoom(gameService.getGameById(gameId));

		// 보내기
		webSocketSendHandler.sendToGame("ready", player.getGameId(),message);
	}

	// 주사위 굴리기
	@MessageMapping("/roll/{playerId}")
	public void playerRollDice(@DestinationVariable String playerId) {
		log.info("주사위 굴리기 by {}", playerId);

		Player player = playerService.getPlayerById(playerId);

		// 주사위 굴리고 데이터 가공
		PlayerDiceMessage playerDiceMessage = playerService.rollDice(playerId);

		// 데이터 전달
		webSocketSendHandler.sendToGame("roll", player.getGameId(), playerDiceMessage);
	}

	// 뉴스 선택하기
	@MessageMapping("/news/{playerId}")
	public void playerChooseNews(@DestinationVariable String playerId, @Payload PlayerNewsRequestDto playerNewsRequestDto) {

		// game 객체 생성
		Game game = gameService.getGameById(playerService.getPlayerById(playerId).getGameId());

		// 뉴스 데이터 가공
		PlayerNewsMessage message = playerService.chooseNews(game, playerNewsRequestDto);

		// 데이터 전달
		webSocketSendHandler.sendToPlayer("news", playerId, game.getId(), message);
	}

	// 플레이어 방 나가기
	@MessageMapping("/leave/{playerId}")
	public void playerLeaveGame(@DestinationVariable String playerId) {
		// 객체 생성
		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());

		// 게임 나가는 로직 처리
		playerService.leaveGame(game, player);

		// 메시지 생성
		List<PlayerReadyInfoMessage> message = playerService.getPlayersInfoForRoom(game);

		// 메시지 전송
		webSocketSendHandler.sendToGame("leave", game.getId(), message);
	}

	// 감옥에 들어갔을 경우
	@MessageMapping("/prison/{playerId}")
	public void playerisPrisoned(@DestinationVariable String playerId) {
		// 객체 생성
		Player player = playerService.getPlayerById(playerId);

		// 감옥 갇히는 로직 처리하고 메시지 생성
		PlayerPrisonMessage message = gameService.setPlayerIsPrisoned(player);

		// 메시지 전송
		webSocketSendHandler.sendToGame("prison", player.getGameId(), message);
	}
}
