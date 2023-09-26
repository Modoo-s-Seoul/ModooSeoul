package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;

@Builder
public record GameTimerExpireMessage(
		Boolean isTimerActivated,
        Long turnInfo
) {
    public static GameTimerExpireMessage of(boolean isTimerActivated, Long turnInfo) {
        return GameTimerExpireMessage.builder()
                .isTimerActivated(isTimerActivated)
                .turnInfo(turnInfo)
                .build();
    }
}
