package online.ft51land.modooseoul.domain.board_status.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.dto.message.BuildingPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.message.FTOilLandMessage;
import online.ft51land.modooseoul.domain.board_status.dto.message.GroundPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.request.BuildingPurchaseRequestDto;
import online.ft51land.modooseoul.domain.board_status.service.BoardStatusService;
import online.ft51land.modooseoul.domain.game.dto.message.GameTimerExpireMessage;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerFTOilLandRequestDto;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
@Slf4j
public class BoardStatusWebSocketController {
    private final BoardStatusService boardStatusService;
    private final PlayerService playerService;
    private final GameService gameService;

    private final WebSocketSendHandler webSocketSendHandler;

    @MessageMapping("/purchase/ground/{playerId}")
    public void playerPurchaseGround(@DestinationVariable String playerId) {
        log.info("땅 구매 by {}", playerId);

        Player player = playerService.getPlayerById(playerId);

        //땅 구매 로직 start
        GroundPurchaseMessage groundPurchaseMessage = boardStatusService.purchaseGround(player);

        //데이터 전달
        webSocketSendHandler.sendToGame("purchase/ground", player.getGameId(),groundPurchaseMessage);
    }

    @MessageMapping("/purchase/building/{playerId}")
    public void purchaseBuilding(@DestinationVariable String playerId, @Payload BuildingPurchaseRequestDto buildingPurchaseRequestDto) {
        log.info("건물 구매 by {}", playerId);

        Player player = playerService.getPlayerById(playerId);

        Game game = gameService.getGameById(player.getGameId());


        //건물 구매 로직 start
        BuildingPurchaseMessage buildingPurchaseMessage = boardStatusService.purchaseBuilding(player,buildingPurchaseRequestDto);


        //데이터 전달
        webSocketSendHandler.sendToGame("purchase/building", player.getGameId(), buildingPurchaseMessage);


        if(player.getCurrentBoardIdx() == 1) { // 시적점에 도착해서 건물을 구매하는 경우
            // 타이머 만료, 턴 넘기기
            gameService.playersActionFinish(game);
            gameService.passTurn(game);
            webSocketSendHandler.sendToGame("timer", game.getId(), GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));
        }

    }


    @MessageMapping("/oil-land/{playerId}")
    public void selectFTOilLand(@DestinationVariable String playerId, @Payload PlayerFTOilLandRequestDto playerFTOilLandRequestDto){
        Player player = playerService.getPlayerById(playerId);

        Game game = gameService.getGameById(player.getGameId());

        FTOilLandMessage ftOilLandMessage = boardStatusService.ftOilLandEffect(game, player, playerFTOilLandRequestDto.boardId());

        webSocketSendHandler.sendToGame("oil-land", player.getGameId(), ftOilLandMessage);


        // 타이머 만료, 턴 넘기기
        gameService.playersActionFinish(game);
        gameService.passTurn(game);
        webSocketSendHandler.sendToGame("timer", game.getId(), GameTimerExpireMessage.of(game.getIsTimerActivated(), game.getTurnInfo()));
    }

}
