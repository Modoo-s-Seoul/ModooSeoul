package online.ft51land.modooseoul.domain.board_status.dto.message;

import lombok.Builder;

@Builder
public record GroundPurchaseMessage(
        Boolean isPurchase,
        Long groundId,
        String playerId
) {
    public static GroundPurchaseMessage of(Boolean isPurchase, Long groundId, String playerId) {
        return GroundPurchaseMessage.builder()
                .isPurchase(isPurchase)
                .groundId(groundId)
                .playerId(playerId)
                .build();
    }
}
