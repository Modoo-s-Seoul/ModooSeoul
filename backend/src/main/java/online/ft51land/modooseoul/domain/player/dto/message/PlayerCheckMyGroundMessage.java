package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerCheckMyGroundMessage(
        Boolean isMyGround,
        Boolean isBuildable
) {
    public static PlayerCheckMyGroundMessage of(Boolean isMyGround, Boolean isBuildable){
        return PlayerCheckMyGroundMessage.builder()
                .isMyGround(isMyGround)
                .isBuildable(isBuildable)
                .build();
    }
}
