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
		log.info("GameWebSocketController - gameStart : {}", gameId);
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
		log.info("GameWebSocketController - getTurnInfo : {}", gameId);

		Game game = gameService.getGameById(gameId);

		webSocketSendHandler.sendToGame("turn", gameId, GameTurnMessage.of(game));
	}


	// 턴 종료
	@MessageMapping("pass-turn/{gameId}")
	public void passTurn(@DestinationVariable String gameId ){
		log.info("GameWebSocketController - turn : {}", gameId);

		Game game = gameService.getGameById(gameId);
		gameService.passTurn(game);
		webSocketSendHandler.sendToGame("pass-turn", gameId, GameTurnMessage.of(game));
	}

	@MessageMapping("/players-info/{gameId}")
	public void getPlayersInfo(@DestinationVariable String gameId) {

		log.info("GameWebSocketController - getPlayersInfo : {}", gameId);

		Game game = gameService.getGameById(gameId);
		List<Player> players = new ArrayList<>();

		for (String playerId : game.getPlayers()) {
			players.add(playerService.getPlayerById(playerId));
		}

		List<PlayerInGameInfoMessage> message = gameService.getPlayersInfo(players);

		webSocketSendHandler.sendToGame("players-info", gameId, message);

		// 1명 제외하고 모두 파산일 경우
		if(gameService.checkGameEnd(gameId)) { //파산하지 않은 수가 1명이면
			//게임 종료
			GameEndMessage gameEndMessage = gameService.endGame(game, EndType.BANKRUPTCY);
			webSocketSendHandler.sendToGame("end", game.getId(), gameEndMessage);
		}
	}

	@MessageMapping("/round-start/{gameId}")
	public void startRound(@DestinationVariable String gameId) {

		log.info("GameWebSocketController - startRound : {}", gameId);
		// game, players 객체 생성
		Game game = gameService.getGameById(gameId);

		// 이미 라운드가 시작했으면 끝
		if (game.getIsRoundStart())
			return;

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

		log.info("GameWebSocketController - startTimer : {} , dto : {}", gameId, gameStartTimerRequestDto);

		Game game = gameService.getGameById(gameId);

		gameService.setIsRoundStartFalse(game);

		Timer timer = new Timer();

		TimerTask task = new TimerTask() {
			@Override
			public void run() { // 지정한 시간만큼 타이머가 돌았을때 실행하는 함수
				// game에 타이머가 종료 됐는지 확인하는 boolean을 두고 확인
				Game timerGame = gameService.getGameById(gameId);

				if(timerGame.getIsTimerActivated()){  //타이머가 활성화 되어 있으면
					// 시간이 다 됐는데 타이머가 활성화 -> 시간내 액션을 수행을 못한경우


					// 선뽑기를 시간내 못 뽑은 경우 -> 그냥 타이머 만료
					// 주사위를 시간내 못 돌린 경우 -> 그냥 타이머 만료

					// 뉴스를 시간내 못 뽑은 경우 -> 못뽑은 사람들 자동으로 뽑아서 보내주고 타이머 만료, 턴패스
					if(gameStartTimerRequestDto.timerType() == TimerType.SELECT_NEWS){
						List<String> playerIdList = timerGame.getPlayers();
						for(String playerId : playerIdList){
							PlayerNewsMessage message = playerService.autoPlayerChooseNews(timerGame, playerId);
							if(message != null){
								// 데이터 전달
								webSocketSendHandler.sendToPlayer("news", playerId, timerGame.getId(), message);
							}
						}
						gameService.passTurn(timerGame); // 턴 넘기기
						// 타이머 만료는 아래에서
					}

					// 시간내 지하철 이동을 못한 경우 -> 자동으로 주사위 굴리기, 타이머 만료
					if(gameStartTimerRequestDto.timerType() == TimerType.SUBWAY){
						// 게임 턴 정보를 확인해서 어떤 플레어 차례인지 알아내기
						Player player = playerService.getPlayerByTurnInfo(timerGame);

						// 주사위 굴리고 데이터 가공
						PlayerDiceMessage playerDiceMessage = playerService.rollDice(player.getId());

						// 데이터 전달
						webSocketSendHandler.sendToGame("roll", player.getGameId(), playerDiceMessage);

						//땅 도착 데이터 전달
						PlayerArrivalBoardMessage<?> playerArrivalBoardMessage = playerService.arrivalBoardInfo(player.getId(), timerGame);
						webSocketSendHandler.sendToGame("arrive-board-info", player.getGameId(),playerArrivalBoardMessage);

					}

					// 시간내 부동산 구매 완료를 못한 경우 -> 그냥 타이머 만료, 턴 패스
					// 출발점 도착시 시간내에 건물을 짓지 못한 경우 -> 타이머 만료, 턴 패스
					// ftoilland 도착시 시간내에 땅을 선택하지 못한 경우 -> 타이머 만료, 턴 패스
					if(gameStartTimerRequestDto.timerType() == TimerType.ESTATE_PURCHASE
							|| gameStartTimerRequestDto.timerType() == TimerType.STARTING_POINT_ARRIVAL
							|| gameStartTimerRequestDto.timerType() == TimerType.FTOILLAND_ARRIVAL
							|| gameStartTimerRequestDto.timerType() == TimerType.FREE_ACTION){
						gameService.passTurn(timerGame);
					}

					gameService.playersActionFinish(timerGame); // game 에 해당하는 모든 player actionfinish init  , 타이머 만료

					// 메시지 보냄
					webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(timerGame.getIsTimerActivated(), timerGame.getTurnInfo()));
					log.info("{} 방에서 시간이 다되어서 타이머 만료 : {}, DTO : {}, IsTimerActivated = {}", timerGame.getId(), LocalDateTime.now(), gameStartTimerRequestDto.toString(), timerGame.getIsTimerActivated() );
				}else{
					// TODO : 나중 else 문 지우기
//					System.out.println(" 타이머 비 활성후 타이머 만료 " + LocalDateTime.now() +" 현재 턴 : "+ game.getTurnInfo());
				}

			}
		};


		// 타이머가 이미 활성화 중이라면
		if(!game.getIsTimerActivated()){
			gameService.startTimer(game, gameStartTimerRequestDto.timerType());
			timer.schedule(task, gameStartTimerRequestDto.timerType().getSeconds()*1000);

			webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));

			log.info("{} 방에서 타이머 시작 : {}, DTO: {}, IsTimerActivated = {}",  LocalDateTime.now(), game.getId(), gameStartTimerRequestDto.toString(), game.getIsTimerActivated());
		}

	}

	@MessageMapping("/timer-cancel/{gameId}")
	public void timerCancel(@DestinationVariable String gameId){

		log.info("GameWebSocketController - timerCancel : {}", gameId);

		Game game = gameService.getGameById(gameId);


		// 타이머가 돌아가는 중 액션이 다 끝나서 타이머를 미리 만료시키고 싶은 경우
		if(game.getIsTimerActivated()){

			// 주사위를 시간 내 돌려서 타이머가 중지되어야 하는 경우  -> 그냥 타이머 만료

			// 시간내 부동산 구매 완료하여 턴 종료를 요청한  경우 -> 그냥 타이머 만료, 턴 패스
			// 출발점에 도착시 건물을 짓지 않고 넘어가는 경우 -> 그냥 타이머 만료, 턴 패스
			// ftoilland 도착시 시간내에 땅을 선택하지 못한 경우 -> 타이머 만료, 턴 패스
			if(game.getTimerType() == TimerType.ESTATE_PURCHASE
					|| game.getTimerType()  == TimerType.STARTING_POINT_ARRIVAL
					|| game.getTimerType()  == TimerType.FTOILLAND_ARRIVAL){
				game.passTurn(playerService.getPlayersByGame(game));
			}


			gameService.playersActionFinish(game); // 타이머 만료

			webSocketSendHandler.sendToGame("timer", gameId, GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));
			log.info("{} 방에 타이머 취소 : {}, 타이머 타입 : {}, IsTimerActivated ={}", gameId, game.getTimerType(), game.getIsTimerActivated());
		}

		// 이미 만료되어 있는 경우 무응답
	}

	@MessageMapping("/free-action/{gameId}")
	public void freeActionStart(@DestinationVariable String gameId) {
		log.info("GameWebSocketController - freeActionStart : {}", gameId);
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
		log.info("GameWebSocketController - getDevidends : {}", gameId);
		// 객체 만들기
		Game game = gameService.getGameById(gameId);
		for (String playerId : game.getPlayers()) {
			Player player = playerService.getPlayerById(playerId);
			PlayerDividendMessage message = PlayerDividendMessage.of(player);
			webSocketSendHandler.sendToPlayer("dividends", playerId, gameId, message);
		}
	}
}