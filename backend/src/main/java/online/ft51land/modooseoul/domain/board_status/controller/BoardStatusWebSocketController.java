package online.ft51land.modooseoul.domain.board_status.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.dto.request.BoardPurchaseRequestDto;
import online.ft51land.modooseoul.domain.board_status.service.BoardStatusService;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
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


    @MessageMapping("/purchase/ground/{playerId}")
    public void playerPurchaseGround(@DestinationVariable String playerId, @Payload BoardPurchaseRequestDto boardPurchaseRequestDto) {
        log.info("땅&건물 구매 by {}", playerId);

        Player player = playerService.getPlayerById(playerId);

        //구매 로직

        //플레이어 돈으로 살 수 있으면

        //땅 정보 바꾸고

        //플레이어 돈 깎고

        //데이터 전달
        //살수 있는지 없는지, 플레이어 깎인 돈, 해당 땅 건물 정보 Map

    }

}
