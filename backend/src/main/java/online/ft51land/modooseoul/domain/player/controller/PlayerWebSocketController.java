package online.ft51land.modooseoul.domain.player.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.message.GameTimerExpireMessage;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.player.dto.message.*;
import online.ft51land.modooseoul.domain.player.dto.request.*;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
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
		webSocketSendHandler.sendToGame("init", gameId, playerService.getPlayersInfoForRoom(game));
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
		webSocketSendHandler.sendToGame("init", player.getGameId(),message);
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

		//땅 도착 데이터 전달
		PlayerArrivalBoardMessage<?> playerArrivalBoardMessage =
				playerService.arrivalBoardInfo(playerId, gameService.getGameById(player.getGameId()));
		webSocketSendHandler.sendToGame("arrive-board-info", player.getGameId(),playerArrivalBoardMessage);

		if(playerArrivalBoardMessage.board().equals("찬스 카드 도착")) {
			webSocketSendHandler.sendToPlayer("chance", playerId, player.getGameId(),playerService.chanceBoardInfo(playerId));
		}


	}

	// TODO: 주사위 굴리기 test - 배포시 삭제
	@MessageMapping("/roll-test/{playerId}")
	public void playerRollDiceTest(@DestinationVariable String playerId, @Payload PlayerDiceTestRequestDto playerDiceTestRequestDto) {
		log.info("주사위 굴리기 by {}", playerId);

		Player player = playerService.getPlayerById(playerId);

		// 주사위 굴리고 데이터 가공
		PlayerDiceMessage playerDiceMessageTest = playerService.rollDiceTest(playerId, playerDiceTestRequestDto);

		// 데이터 전달
		webSocketSendHandler.sendToGame("roll", player.getGameId(), playerDiceMessageTest);

		//땅 도착 데이터 전달
		PlayerArrivalBoardMessage<?> playerArrivalBoardMessage =
				playerService.arrivalBoardInfo(playerId, gameService.getGameById(player.getGameId()));
		webSocketSendHandler.sendToGame("arrive-board-info", player.getGameId(),playerArrivalBoardMessage);

		if(playerArrivalBoardMessage.board().equals("찬스 카드 도착")) {
			webSocketSendHandler.sendToPlayer("chance", playerId, player.getGameId(),playerService.chanceBoardInfo(playerId));
		}

	}

	// 뉴스 선택하기
	@MessageMapping("/news/{playerId}")
	public void playerChooseNews(@DestinationVariable String playerId, @Payload PlayerNewsRequestDto playerNewsRequestDto) throws InterruptedException {

		// game 객체 생성
		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());

		// 뉴스를 뽑은 플레이어의 수
		Long finishPlayerCnt = playerService.playerActionFinish(player, game);

		// 뉴스 데이터 가공
		PlayerNewsMessage message = playerService.chooseNews(game, playerId, playerNewsRequestDto);

		// 데이터 전달
		webSocketSendHandler.sendToPlayer("news", playerId, game.getId(), message);

		//----------------------뉴스 전달은 끝

		//----------------------플레이어가 뉴스를 모두 뽑았는지 확인
		if(finishPlayerCnt == gameService.getPlayingPlayerCnt(game)){
			Thread.sleep(2000);
			gameService.playersActionFinish(game); // game 에 해당하는 모든 player pass init  , 타이머 종료
			gameService.passTurn(game); // 턴 넘기기
		}

		Game resultGame = gameService.getGameById(player.getGameId());

		// 메시지 전송
		webSocketSendHandler.sendToGame("action-finish", player.getGameId(), PlayerFinishMessage.of(resultGame));
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
		PlayerLeaveMessage message = playerService.getLeavePlayerName(player);

		// 메시지 전송
		webSocketSendHandler.sendToGame("leave", game.getId(), message);

		// 게임 나간 후에 방 정보 다시 전송
		webSocketSendHandler.sendToGame("init", game.getId(), playerService.getPlayersInfoForRoom(game));
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

	// 지하철 이용 가능 한지 확인
	@MessageMapping("/check-subway/{playerId}")
	public void playerCheckSubway(@DestinationVariable String playerId){

		Player player = playerService.getPlayerById(playerId);

		PlayerCheckSubwayMessage message = playerService.playerCheckSubway(player);


		// 메시지 전송
		webSocketSendHandler.sendToGame("check-subway", player.getGameId(), message);
	}

	// 지하철에서 이동할 칸을 선택해서 이동할때
	@MessageMapping("/subway/{playerId}")
	public void playerTakeSubway(@DestinationVariable String playerId, @Payload PlayerSubwayRequestDto playerTakeSubwayRequestDto){

		Player player = playerService.getPlayerById(playerId);


		Game game = gameService.getGameById(player.getGameId());

		if(!game.getIsTimerActivated()){
			throw new BusinessException(ErrorMessage.TIMER_EXPIRED);
		}


		PlayerSubwayMessage message = playerService.takeSubway(player, playerTakeSubwayRequestDto.boardId());


		// 메시지 전송
		webSocketSendHandler.sendToGame("subway", player.getGameId(), message);


		//땅 도착 데이터 전달
		PlayerArrivalBoardMessage<?> playerArrivalBoardMessage = playerService.arrivalBoardInfo(playerId, game);
		webSocketSendHandler.sendToGame("arrive-board-info", player.getGameId(),playerArrivalBoardMessage);

		// 타이머 만료, 턴은 안넘어감
		gameService.playersActionFinish(game);
		webSocketSendHandler.sendToGame("timer", game.getId(), GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));


	}


	// 공통 턴(1분, 선뽑기, 뉴스뽑기)에서 자기 행동 완료
	@MessageMapping("/action-finish/{playerId}")
	public void playerActionFinish(@DestinationVariable String playerId){

		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());

		// 패스를 요청한 플레이어 isPass 값 변경
		// 패스한 플레이어 수 증가
		Long finishPlayerCnt = playerService.playerActionFinish(player, game);

		// 모두가 턴 넘길 준비가 되어 있다면
		if(finishPlayerCnt == gameService.getPlayingPlayerCnt(game)){
			gameService.playersActionFinish(game); // game 에 해당하는 모든 player pass init  , 타이머 종료
			gameService.passTurn(game); //턴 넘기기
		}

		Game resultGame = gameService.getGameById(player.getGameId());

		// 메시지 전송
		webSocketSendHandler.sendToGame("action-finish", player.getGameId(), PlayerFinishMessage.of(resultGame));
	}

	@MessageMapping("/tax/payment/{playerId}")
	public void playerPayTax(@DestinationVariable String playerId) {
		Player player = playerService.getPlayerById(playerId);

		PlayerTaxMessage message = playerService.taxPayment(player);

		webSocketSendHandler.sendToPlayer("tax", playerId, player.getGameId(), message);
	}

	@MessageMapping("/tax/evasion/{playerId}")
	public void playerEvadeTax(@DestinationVariable String playerId) {
		Player player = playerService.getPlayerById(playerId);

		PlayerTaxMessage message = PlayerTaxMessage.of(player);

		webSocketSendHandler.sendToPlayer("tax", playerId, player.getGameId(), message);
	}

	// 플레이어 신고하기
	@MessageMapping("/report/{playerId}")
	public void playerReport(@DestinationVariable String playerId, @Payload PlayerReportRequestDto dto) {
		Player player = playerService.getPlayerById(playerId);

		PlayerReportMessage message = playerService.reportPlayer(player, dto.nickname());

		webSocketSendHandler.sendToPlayer("report", playerId, player.getGameId(), message);
	}

	// 탈세여부 확인하기
	@MessageMapping("/evasion-check/{playerId}")
	public void checkEvasion(@DestinationVariable String playerId) {
		// 객체 생성
		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());
		if (player.getReporteePlayerName() == null) {
			throw new BusinessException(ErrorMessage.PLAYER_NOT_FOUND);
		}

		PlayerEvasionMessage message = null;
		Player reportee = null;
		for (String playerIds : game.getPlayers()) {
			reportee = playerService.getPlayerById(playerIds);
			if (reportee.getNickname().equals(player.getReporteePlayerName())) {
				message = playerService.checkEvasion(player, reportee);
				break;
			}
		}
		if (reportee == null) {
			throw new BusinessException(ErrorMessage.PLAYER_NOT_FOUND);
		}

		if (message == null) {
			throw new BusinessException(ErrorMessage.INTERVAL_SERVER_ERROR);
		}

		webSocketSendHandler.sendToPlayer("evasion-reporter", playerId, player.getGameId(), message);

		// 신고 당한 사람에게 보내는 메시지
		message = PlayerEvasionMessage.ofGame(message.isEvade(), reportee);

		webSocketSendHandler.sendToGame("evasion-notice", player.getGameId(),message);
	}

	@MessageMapping("/news-check/{playerId}")
	public void checkNews(@DestinationVariable String playerId) {
		log.info("뉴스 체크 by {}", playerId);
		Player player = playerService.getPlayerById(playerId);
		List<PlayerNewsMessage> playerNewsMessageList = playerService.checkNews(player);
		webSocketSendHandler.sendToPlayer("news", playerId, player.getGameId(), playerNewsMessageList);

	}

	@MessageMapping("/ground-sell/{playerId}")
	public void sellGround(@DestinationVariable String playerId, @Payload PlayerSellGroundRequestDto playerSellGroundRequestDto){
		log.info("땅 판매 by {}, 판매땅 {}",playerId, playerSellGroundRequestDto);
		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());
		PlayerGroundSellMessage playerGroundSellMessage = playerService.sellGround(game, player, playerSellGroundRequestDto);
		webSocketSendHandler.sendToGame("ground-sell", player.getGameId(), playerGroundSellMessage);
	}

	@MessageMapping("/tax-service/{playerId}")
	public void playerArrivedTaxService(@DestinationVariable String playerId) {
		// 객체 생성
		Player player = playerService.getPlayerById(playerId);
		Game game = gameService.getGameById(player.getGameId());

		// 턴 정보 확인 TODO : 주석해제하기
//		if(!player.getTurnNum().equals(game.getTurnInfo())){
//			throw  new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
//		}

		// 로직 실행
		PlayerEvasionMessage message = playerService.playerArrivedtaxService(player);

		// 메시지 전송
		webSocketSendHandler.sendToGame("tax-service", game.getId(), message);
	}

}
