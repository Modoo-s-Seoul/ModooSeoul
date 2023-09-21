package online.ft51land.modooseoul.domain.board_status.dto.message;

import lombok.Builder;

@Builder
public record GroundPurchaseMessage(
        Boolean isPurchase,
        String message,
        Long groundIdx,
        String playerId
) {
    public static GroundPurchaseMessage of(Boolean isPurchase, String message, Long groundIdx, String playerId) {
        return GroundPurchaseMessage.builder()
                .isPurchase(isPurchase)
                .message(message)
                .groundIdx(groundIdx)
                .playerId(playerId)
                .build();
    }
}
