package online.ft51land.modooseoul.domain.game.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.message.*;
import online.ft51land.modooseoul.domain.game.dto.request.GameStartTimerRequestDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.entity.enums.EndType;
import online.ft51land.modooseoul.domain.game.entity.enums.TimerType;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.player.dto.message.*;
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
					// 시간이 다 됐는데 타이머가 활성화 -> 시간내 액션을 수행을 못한경우


					// 선뽑기를 시간내 못 뽑은 경우 -> 그냥 타이머 만료
					// 주사위를 새간내 못 돌린 경우 -> 그냥 타이머 만료
					// 시간내 부동산 구매를 못한 경우 -> 그냥 타이머 만료

					// 뉴스를 시간내 못 뽑은 경우 -> 못뽑은 사람들 자동으로 뽑아서 보내주고 타이머 만료
					if(gameStartTimerRequestDto.timerType() == TimerType.SELECT_NEWS){
						List<String> playerIdList = timerGame.getPlayers();
						for(String playerId : playerIdList){
							PlayerNewsMessage message = playerService.autoPlayerChooseNews(timerGame, playerId);
							if(message != null){
								// 데이터 전달
								webSocketSendHandler.sendToPlayer("news", playerId, timerGame.getId(), message);
							}
						}
					}

					// 시간내 지하철 이동을 못한 경우 -> 자동으로 주사위 굴리기
					if(gameStartTimerRequestDto.timerType() == TimerType.SUBWAY){
						// 게임 턴 정보를 확인해서 어떤 플레어 차례인지 알아내기
						Player player = playerService.getPlayerByTurnInfo(timerGame);

						// 주사위 굴리고 데이터 가공
						PlayerDiceMessage playerDiceMessage = playerService.rollDice(player.getId());

						// 데이터 전달
						webSocketSendHandler.sendToGame("roll", player.getGameId(), playerDiceMessage);

						//땅 도착 데이터 전달
						PlayerArrivalBoardMessage<?> playerArrivalBoardMessage = playerService.arrivalBoardInfo(player.getId());
						webSocketSendHandler.sendToGame("arrive-board-info", player.getGameId(),playerArrivalBoardMessage);

					}

					/** TODO : playersActionFinish 이거랑 별도로 타이머 종료, 턴넘기기 별도로 처리해아함
					 * 주사위 던졌을때는 그냥 타이머만 종료 시키고
					 * 이후 도착한 땅에 대해서 액션을 다 처리 했을때 턴넘기기를 해야함
					 * 근데 주사위 안던져서 타이머가 만료가 안된 상태에서
					 * playersActionFinish
					 *  이걸 처리해버리면 턴이 넘어가 버리니까 이건 IF문 걸어서 공통일때만 처리하도록 해야함
					 */
					gameService.playersActionFinish(timerGame); // game 에 해당하는 모든 player actionfinish init  , 타이머 종료 , 턴 넘기기

					// 메시지 보냄
					webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(timerGame.getIsTimerActivated(), timerGame.getTurnInfo()));
					log.info("{} 방에서 시간이 다되어서 타이머 만료 : {}", timerGame.getId(), LocalDateTime.now() );
				}else{
					// TODO : 나중 else 문 지우기
					System.out.println(" 타이머 비활성후 타이머 만료 " + LocalDateTime.now() +" 현재 턴 : "+ game.getTurnInfo());
				}
				
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
			gameService.playersActionFinish(game);
			/**TODO : 다음 턴으로 넘어가는지 생각해보고 넘어가면 passTurn 해야함 / 지금은 타이머 만료까지만 되어 있음
			 *  주사위는 다음턴으로 넘어가면안됨..
			 *  지하철도 다음턴으로 넘어가면안됨..
			 *
			 *  부동산 구매하다가 구매를 멈추는 경우 호출 될텐데
			 *  이때 턴넘기는거 처리
			 *
 			 */

			webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));
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

	// 배당금 확인
	@MessageMapping("/dividends/{gameId}")
	public void getDevidends(@DestinationVariable String gameId) {
		// 객체 만들기
		Game game = gameService.getGameById(gameId);
		for (String playerId : game.getPlayers()) {
			Player player = playerService.getPlayerById(playerId);
			PlayerDividendMessage message = PlayerDividendMessage.of(player);
			webSocketSendHandler.sendToPlayer("dividends", playerId, gameId, message);
		}
	}
}