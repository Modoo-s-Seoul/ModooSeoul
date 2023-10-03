package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerStartPointArriveMessage(
        Boolean isStartPoint,
        Boolean isEstatesNotNull
) {
    public static PlayerStartPointArriveMessage of(Boolean isStartPoint, Boolean isEstatesNotNull){
        return PlayerStartPointArriveMessage.builder()
                .isStartPoint(isStartPoint)
                .isEstatesNotNull(isEstatesNotNull)
                .build();
    }
}
