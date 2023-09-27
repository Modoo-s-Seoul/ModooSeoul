package online.ft51land.modooseoul.domain.board_status.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.board_status.entity.enums.PurchaseMessage;

@Builder
public record BuildingPurchaseMessage(
        Boolean isPurchase,
        PurchaseMessage purchaseMessage,
        Long boardIdx,
        Long buildingIdx,
        Long buildingId,
        String playerId
) {
    public static BuildingPurchaseMessage of(Boolean isPurchase,PurchaseMessage purchaseMessage, Long boardIdx, Long buildingIdx, Long buildingId, String playerId) {
        return BuildingPurchaseMessage.builder()
                .isPurchase(isPurchase)
                .purchaseMessage(purchaseMessage)
                .boardIdx(boardIdx)
                .buildingIdx(buildingIdx)
                .buildingId(buildingId)
                .playerId(playerId)
                .build();
    }
}
