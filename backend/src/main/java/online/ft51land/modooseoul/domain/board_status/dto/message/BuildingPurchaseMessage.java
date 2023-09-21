package online.ft51land.modooseoul.domain.board_status.dto.message;

import lombok.Builder;

@Builder
public record BuildingPurchaseMessage(
        Boolean isPurchase,
        String message,
        Long groundIdx,
        Long buildingIdx,
        Long buildingId,
        String playerId
) {
    public static BuildingPurchaseMessage of(Boolean isPurchase, String message, Long groundIdx, Long buildingIdx, Long buildingId, String playerId) {
        return BuildingPurchaseMessage.builder()
                .isPurchase(isPurchase)
                .message(message)
                .groundIdx(groundIdx)
                .buildingIdx(buildingIdx)
                .buildingId(buildingId)
                .playerId(playerId)
                .build();
    }
}
