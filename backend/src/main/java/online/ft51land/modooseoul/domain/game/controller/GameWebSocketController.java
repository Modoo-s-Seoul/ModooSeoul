package online.ft51land.modooseoul.domain.game.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.message.GameRoundStartMessage;
import online.ft51land.modooseoul.domain.game.dto.message.GameStartMessage;
import online.ft51land.modooseoul.domain.game.dto.message.GameTimerExpireMessage;
import online.ft51land.modooseoul.domain.game.dto.message.GameTurnMessage;
import online.ft51land.modooseoul.domain.game.dto.request.GameStartTimerRequestDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerInGameInfoMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerPrisonMessage;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

@Slf4j
@Controller
@AllArgsConstructor
public class GameWebSocketController {

	private final GameService gameService;
	private final PlayerService playerService;
	private final WebSocketSendHandler webSocketSendHandler;

	@MessageMapping("/start/{gameId}")
	public void gameStart(@DestinationVariable String gameId) {
		Game game = gameService.getGameById(gameId);
		List<Player> players = new ArrayList<>();
		for (String playerId : game.getPlayers()) {
			players.add(playerService.getPlayerById(playerId));
		}

		// 게임 시작 가능 여부 반환
		GameStartMessage gameStartMessage = gameService.gameStart(game, players);

		// 메시지 번호 가지고 오기 게임 시작 가능한지 여부 전송
		webSocketSendHandler.sendToGame("start", gameId, gameStartMessage);

	}

	// 현재 턴 정보
	@MessageMapping("/turn/{gameId}")
	public void getTurnInfo(@DestinationVariable String gameId) {
		Game game = gameService.getGameById(gameId);

		webSocketSendHandler.sendToGame("turn", gameId, GameTurnMessage.of(game));
	}


	// 턴 종료
	@MessageMapping("pass/{gameId}")
	public void passTurn(@DestinationVariable String gameId ){
		Game game = gameService.getGameById(gameId);
		gameService.passTurn(game);
		webSocketSendHandler.sendToGame("pass", gameId, GameTurnMessage.of(game));
	}

	@MessageMapping("/players-info/{gameId}")
	public void getPlayersInfo(@DestinationVariable String gameId) {
		Game game = gameService.getGameById(gameId);
		List<Player> players = new ArrayList<>();

		for (String playerId : game.getPlayers()) {
			players.add(playerService.getPlayerById(playerId));
		}

		List<PlayerInGameInfoMessage> message = gameService.getPlayersInfo(players);

		webSocketSendHandler.sendToGame("players-info", gameId, message);
	}

	@MessageMapping("/roundStart/{gameId}")
	public void startRound(@DestinationVariable String gameId) {
		// game, players 객체 생성
		Game game = gameService.getGameById(gameId);
		List<Player> players = new ArrayList<>();

		for (String playerId : game.getPlayers()) {
			players.add(playerService.getPlayerById(playerId));
		}

//		// 예외 처리
//		if (game.getTurnInfo() != game.getPlayers().size()) {
//			throw new BusinessException(ErrorMessage.INTERVAL_SERVER_ERROR);
//		}

		GameRoundStartMessage message = gameService.startRound(game, players);

		webSocketSendHandler.sendToGame("roundStart", gameId, message);

	}

	@MessageMapping("/timer/{gameId}")
	public void startTimer(@DestinationVariable String gameId, @Payload GameStartTimerRequestDto gameStartTimerRequestDto){
		Game game = gameService.getGameById(gameId);

		Timer timer = new Timer();

		TimerTask task = new TimerTask() {
			@Override
			public void run() { // 지정한 시간만큼 타이머가 돌았을때 실행하는 함수
				// game에 타이머가 종료 됐는지 확인하는 boolean을 두고 확인
				Game timerGame = gameService.getGameById(gameId);

				if(timerGame.getIsTimerActivated()){  //타이머가 활성화 되어 있으면
					gameService.expiredTimer(timerGame); //만료시키고
					// 메시지 보냄
					webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(timerGame.getIsTimerActivated()));
					log.info("{} 방에서 시간이 다되어서 타이머 만료 : {}", timerGame.getId(), LocalDateTime.now() );
				}
				//타이머를 비활성화 시킨 후 타이머가 만료되는 경우 무응답

			}
		};

		log.info("{} 방에서 타이머 시작 : {}", game.getId(), LocalDateTime.now() );

		// 타이머 isExpiredTimer
		gameService.startTimer(game);
		timer.schedule(task, gameStartTimerRequestDto.seconds()*1000);

		webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(game.getIsTimerActivated()));

	}

	@MessageMapping("/timer-cancel/{gameId}")
	public void timerCancel(@DestinationVariable String gameId){

		Game game = gameService.getGameById(gameId);

		// 타이머가 돌아가는 중 액션이 다 끝나서 타이머를 미리 만료시키고 싶은 경우
		if(game.getIsTimerActivated()){
			gameService.expiredTimer(game);
			webSocketSendHandler.sendToGame("timer-cancel", gameId, GameTimerExpireMessage.of(game.getIsTimerActivated()));
		}

		// 이미 만료되어 있는 경우 무응답
	}

	@MessageMapping("/free-action/{gameId}")
	public void freeActionStart(@DestinationVariable String gameId) {
		// 객체 만들기
		Game game = gameService.getGameById(gameId);

		// 각 플레이어 별로 메시지 생성 후 전송
		for (String playerId : game.getPlayers()) {
			Player player = playerService.getPlayerById(playerId);
			webSocketSendHandler.sendToPlayer("free-action", playerId, gameId, PlayerPrisonMessage.of(player));
		}

		// 턴 넘기기
		gameService.passTurn(game);
	}
}