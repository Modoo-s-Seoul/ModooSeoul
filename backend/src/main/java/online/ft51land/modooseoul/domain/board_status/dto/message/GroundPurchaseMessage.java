package online.ft51land.modooseoul.domain.board_status.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.board_status.entity.enums.PurchaseMessage;

@Builder
public record GroundPurchaseMessage(
        Boolean isPurchase,
        String message,
        Long groundIdx,
        Long playerIdx
) {
    public static GroundPurchaseMessage of(Boolean isPurchase, PurchaseMessage purchaseMessage, Long groundIdx, Long playerIdx) {
        return GroundPurchaseMessage.builder()
                .isPurchase(isPurchase)
                .message(purchaseMessage.getMessage())
                .groundIdx(groundIdx)
                .playerIdx(playerIdx)
                .build();
    }
}
