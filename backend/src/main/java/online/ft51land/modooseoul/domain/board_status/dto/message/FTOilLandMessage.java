package online.ft51land.modooseoul.domain.board_status.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;

@Builder
public record FTOilLandMessage(
        Long playerCash,
        Long FTOilLandBoardId,
        BoardStatus boardStatus

) {
    public static FTOilLandMessage of(Long playerCash, BoardStatus boardStatus, Long FTOilLandBoardId){
        return FTOilLandMessage.builder()
                .playerCash(playerCash)
                .FTOilLandBoardId(FTOilLandBoardId)
                .boardStatus(boardStatus)
                .build();
    }

}
