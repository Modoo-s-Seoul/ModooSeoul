package online.ft51land.modooseoul.domain.player.dto.response;

import lombok.Builder;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerPayResponseDto(
            BoardStatus boardStatus,
            Player payPlayer,
            Player ownerPlayer
        ) {
    public static PlayerPayResponseDto of(BoardStatus boardStatus, Player payPlayer, Player ownerPlayer) {
        return PlayerPayResponseDto.builder()
                .boardStatus(boardStatus)
                .payPlayer(payPlayer)
                .ownerPlayer(ownerPlayer)
                .build();
    }

}
