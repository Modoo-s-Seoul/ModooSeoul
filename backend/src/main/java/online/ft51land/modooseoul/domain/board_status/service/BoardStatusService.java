package online.ft51land.modooseoul.domain.board_status.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.dto.message.GroundPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.request.BoardPurchaseRequestDto;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.messagenum.repository.MessageNumRepository;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardStatusService {
    private final BoardStatusRepository boardStatusRepository;
    private final PlayerRepository playerRepository;

    public GroundPurchaseMessage purchaseGround(Player player) {
        boolean isPurchase = true;
        String message = "";

        //현재 플레이어가 위치한 땅이 소유자가 없는지 한번 더 체크
        String curBoardId = player.getGameId()+"@"+player.getCurrentBoardId();

        BoardStatus boardStatus = boardStatusRepository.findById(curBoardId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));

        //플레이어 자산으로 땅을 살 수 있는지 체크
        if(player.getCash() < boardStatus.getPrice()) {

            isPurchase = false;
            message = "구매할 돈이 부족합니다.";
        }

        if(boardStatus.getOwnerId() != null) {

            isPurchase = false;
            message = "땅의 소유자가 있습니다.";
        }

        //구매
        if(isPurchase) {
            //player 현금 정보 업데이트
            player.purchaseGround(boardStatus.getPrice());
            playerRepository.save(player);

            //board status 업데이트
            boardStatus.purchaseGround(player.getId());
            boardStatusRepository.save(boardStatus);

            message = "구매 성공";
        }

        return (GroundPurchaseMessage.of(isPurchase, message, player.getCurrentBoardId(), player.getId()));
    }
}
