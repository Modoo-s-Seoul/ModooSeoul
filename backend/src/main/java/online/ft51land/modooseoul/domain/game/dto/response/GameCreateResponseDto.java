package online.ft51land.modooseoul.domain.game.dto.response;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.Game;

@Builder
public record GameCreateResponseDto(
        String id
) {
    public static GameCreateResponseDto of(Game game) {
        return GameCreateResponseDto.builder()
                                    .id(game.getId())
                                    .build();
    }
}


