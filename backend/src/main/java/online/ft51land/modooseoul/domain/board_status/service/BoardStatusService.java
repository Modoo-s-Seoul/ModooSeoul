package online.ft51land.modooseoul.domain.board_status.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.dto.message.GroundPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.request.BoardPurchaseRequestDto;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.messagenum.repository.MessageNumRepository;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardStatusService {
    private final BoardStatusRepository boardStatusRepository;
    private final MessageNumRepository messageNumRepository;

    private final PlayerService playerService;

    public GroundPurchaseMessage purchaseGround(Player player, BoardPurchaseRequestDto boardPurchaseRequestDto) {

        //현재 플레이어가 위치한 땅이 소유자가 없는지 한번 더 체크
        String curBoardId = player.getGameId()+"@"+player.getCurrentBoardId();

        BoardStatus boardStatus = boardStatusRepository.findById(curBoardId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));

        if(boardStatus.getOwnerId() != null) {
            //null이 아닌 경우 (소유자가 있음) -> 여기 예외 처리 하는 게 맞나?
            throw new BusinessException(ErrorMessage.GROUND_OWNER_ALREADY_HAVE);
        }

        //플레이어 자산으로 땅을 살 수 있는지 체크
        if(player.getCash() < boardStatus.getPrice()) {
            //돈이 부족한 경우
            throw new BusinessException(ErrorMessage.NEED_MORE_MONEY);
        }

        //구매
        
        //player 현금 정보 업데이트
        playerService.purchaseGround(player, boardStatus.getPrice());

        //board status 업데이트
        boardStatus.purchaseGround(player.getId());
        boardStatusRepository.save(boardStatus);


        return (GroundPurchaseMessage.of(true, player.getCurrentBoardId(), player.getId()));
    }
}
