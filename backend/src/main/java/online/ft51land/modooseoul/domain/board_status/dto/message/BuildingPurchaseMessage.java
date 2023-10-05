package online.ft51land.modooseoul.domain.board_status.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.board_status.entity.enums.PurchaseMessage;

@Builder
public record BuildingPurchaseMessage(
        Boolean isPurchase,
        String message,
        Long boardIdx,
        Long buildingIdx,
        Long buildingId,
        Long playerIdx
) {
    public static BuildingPurchaseMessage of(Boolean isPurchase,PurchaseMessage purchaseMessage, Long boardIdx, Long buildingIdx, Long buildingId, Long playerIdx) {
        return BuildingPurchaseMessage.builder()
                .isPurchase(isPurchase)
                .message(purchaseMessage.getMessage())
                .boardIdx(boardIdx)
                .buildingIdx(buildingIdx)
                .buildingId(buildingId)
                .playerIdx(playerIdx)
                .build();
    }
}
