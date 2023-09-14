package online.ft51land.modooseoul.domain.game.dto.response;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.Game;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record GameCreateResponseDto(
        String id,
        List<String> players,
        Boolean isStart,
        LocalDateTime createDate
) {
    public static GameCreateResponseDto of(Game game){
        return GameCreateResponseDto.builder()
                                    .id(game.getId())
                                    .players(game.getPlayers())
                                    .isStart(game.getIsStart())
                                    .createDate(game.getCreatedDate())
                                    .build();
    }
}


