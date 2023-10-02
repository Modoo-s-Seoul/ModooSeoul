package online.ft51land.modooseoul.domain.player.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.message.GameTimerExpireMessage;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.player.dto.message.*;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerNewsRequestDto;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerReportRequestDto;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerSubwayRequestDto;
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

		//땅 도착 데이터 전달
		PlayerArrivalBoardMessage<?> playerArrivalBoardMessage = playerService.arrivalBoardInfo(playerId);
		webSocketSendHandler.sendToGame("arrive-board-info", player.getGameId(),playerArrivalBoardMessage);

		if(playerArrivalBoardMessage.board().equals("찬스 카드 도착")) {
			webSocketSendHandler.sendToPlayer("arrive-board-info", playerId, player.getGameId(),playerService.chanceBoardInfo(playerId));
		}
	}

	// 뉴스 선택하기
	@MessageMapping("/news/{playerId}")
	public void playerChooseNews(@DestinationVariable String playerId, @Payload PlayerNewsRequestDto playerNewsRequestDto) {

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
			throw new BusinessException(ErrorMessage.BAD_REQUEST);
		}


		PlayerSubwayMessage message = playerService.takeSubway(player, playerTakeSubwayRequestDto.boardId());


		// 메시지 전송
		webSocketSendHandler.sendToGame("subway", player.getGameId(), message);


		//땅 도착 데이터 전달
		PlayerArrivalBoardMessage<?> playerArrivalBoardMessage = playerService.arrivalBoardInfo(playerId);
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


}
