package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.Game;

@Builder
public record GameTimerExpireMessage(
		Boolean isExpired
) {
    public static GameTimerExpireMessage of(boolean isExpired) {
        return GameTimerExpireMessage.builder()
                .isExpired(isExpired)
                .build();
    }
}
