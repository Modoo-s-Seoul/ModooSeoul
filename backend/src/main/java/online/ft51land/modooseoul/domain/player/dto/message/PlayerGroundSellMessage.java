package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerGroundSellMessage(
        Boolean isSell,
        String message,
        Long groundIdx
) {
    public static PlayerGroundSellMessage of(Boolean isSell, String message, Long groundIdx) {
        return PlayerGroundSellMessage.builder()
                .isSell(isSell)
                .message(message)
                .groundIdx(groundIdx)
                .build();
    }
}
