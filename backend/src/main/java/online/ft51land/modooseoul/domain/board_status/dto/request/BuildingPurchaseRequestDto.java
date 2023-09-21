package online.ft51land.modooseoul.domain.board_status.dto.request;

public record BuildingPurchaseRequestDto(
        String boardId,
        String buildingIdx,
        String buildingId
) {
}
