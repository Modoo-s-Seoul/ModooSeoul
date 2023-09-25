package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;

@Builder
public record GameTimerExpireMessage(
		Boolean isTimerActivated
) {
    public static GameTimerExpireMessage of(boolean isTimerActivated) {
        return GameTimerExpireMessage.builder()
                .isTimerActivated(isTimerActivated)
                .build();
    }
}
