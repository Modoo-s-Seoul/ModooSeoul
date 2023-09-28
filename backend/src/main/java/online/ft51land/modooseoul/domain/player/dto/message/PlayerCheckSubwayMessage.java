package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerCheckSubwayMessage(
        Boolean isSubway,
        Boolean isPayable
) {
    public static PlayerCheckSubwayMessage of(Boolean isSubway, Boolean isPayable){
        return PlayerCheckSubwayMessage.builder()
                .isSubway(isSubway)
                .isPayable(isPayable)
                .build();
    }
}
