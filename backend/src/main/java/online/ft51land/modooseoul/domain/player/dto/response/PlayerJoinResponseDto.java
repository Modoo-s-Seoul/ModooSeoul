package online.ft51land.modooseoul.domain.player.dto.response;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerJoinResponseDto(
        String id
) {
    public static PlayerJoinResponseDto of(Player player){
        return PlayerJoinResponseDto.builder()
                .id(player.getId())
                .build();
    }
}
