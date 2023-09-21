package online.ft51land.modooseoul.domain.board_status.dto.request;

public record BuildingPurchaseRequestDto(
        Long boardIdx,
        Long buildingIdx,
        Long buildingId
) {
}
