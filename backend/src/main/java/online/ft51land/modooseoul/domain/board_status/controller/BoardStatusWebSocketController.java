package online.ft51land.modooseoul.domain.board_status.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.dto.message.GroundPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.request.BoardPurchaseRequestDto;
import online.ft51land.modooseoul.domain.board_status.service.BoardStatusService;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
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

    private final WebSocketSendHandler webSocketSendHandler;

    @MessageMapping("/purchase/ground/{playerId}")
    public void playerPurchaseGround(@DestinationVariable String playerId) {
        log.info("땅 구매 by {}", playerId);

        Player player = playerService.getPlayerById(playerId);

        //땅 구매 로직 start
        GroundPurchaseMessage groundPurchaseMessage = boardStatusService .purchaseGround(player);

        //데이터 전달
        webSocketSendHandler.sendToGame("purchase/ground",player.getGameId(),groundPurchaseMessage);
    }

}
