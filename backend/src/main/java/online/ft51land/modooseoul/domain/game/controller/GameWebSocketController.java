package online.ft51land.modooseoul.domain.game.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.message.*;
import online.ft51land.modooseoul.domain.game.dto.request.GameStartTimerRequestDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.entity.enums.EndType;
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
	@MessageMapping("pass-turn/{gameId}")
	public void passTurn(@DestinationVariable String gameId ){
		Game game = gameService.getGameById(gameId);
		gameService.passTurn(game);
		webSocketSendHandler.sendToGame("pass-turn", gameId, GameTurnMessage.of(game));
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

	@MessageMapping("/round-start/{gameId}")
	public void startRound(@DestinationVariable String gameId) {
		// game, players 객체 생성
		log.info("gameId -> {}",gameId);
		Game game = gameService.getGameById(gameId);
		List<Player> players = new ArrayList<>();

		for (String playerId : game.getPlayers()) {
			players.add(playerService.getPlayerById(playerId));
		}

//		// 예외 처리
//		if (game.getTurnInfo() != game.getPlayers().size()) {
//			throw new BusinessException(ErrorMessage.INTERVAL_SERVER_ERROR);
//		}

		if(game.getCurrentRound() >= 10) {
			GameEndMessage gameEndMessage = gameService.endGame(game, EndType.END_OF_TURN);
			webSocketSendHandler.sendToGame("end", gameId, gameEndMessage);
			return;
		}

		GameRoundStartMessage gameRoundStartMessage = gameService.startRound(game, players);
		webSocketSendHandler.sendToGame("round-start", gameId, gameRoundStartMessage);
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
					/**  TODO : action을 완료하지 못한 플레이어 찾아서 완료 시켜주기
					 *  뉴스 같은 경우는 서버에서 임시로 정해주는 게 아니라서 타이머가 만료가 되어버리면 게임이 진행이 안된다.
 					 */

					gameService.playersActionFinish(timerGame); // game 에 해당하는 모든 player actionfinish init  , 타이머 종료 , 턴 넘기기

					// 메시지 보냄
					webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(timerGame.getIsTimerActivated(), timerGame.getTurnInfo()));
					log.info("{} 방에서 시간이 다되어서 타이머 만료 : {}", timerGame.getId(), LocalDateTime.now() );
				}
				//타이머를 비활성화 시킨 후 타이머가 만료되는 경우 무응답
			}
		};

		log.info("{} 방에서 타이머 시작 : {}", game.getId(), LocalDateTime.now() );

		// 타이머 isExpiredTimer
		gameService.startTimer(game);
		timer.schedule(task, gameStartTimerRequestDto.timerType().getSeconds()*1000);

		webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));

	}

	@MessageMapping("/timer-cancel/{gameId}")
	public void timerCancel(@DestinationVariable String gameId){

		Game game = gameService.getGameById(gameId);

		// 타이머가 돌아가는 중 액션이 다 끝나서 타이머를 미리 만료시키고 싶은 경우
		if(game.getIsTimerActivated()){
			gameService.expiredTimer(game);
			// TODO : 다음 턴으로 넘어가는지 생각해보고 넘어가면 passTurn 해야함 / 지금은 타이머 만료까지만 되어 있음
			webSocketSendHandler.sendToGame("timer-cancel", gameId, GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));
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
	}
}