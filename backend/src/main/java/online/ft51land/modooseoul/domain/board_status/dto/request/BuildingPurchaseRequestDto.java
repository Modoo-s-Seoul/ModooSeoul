package online.ft51land.modooseoul.domain.board_status.dto.request;

public record BuildingPurchaseRequestDto(
        Long boardIdx, // 땅번호
        Long buildingIdx, // 땅내 건물 위치 번호 1 ~ 3
        Long buildingId // 건물 번호 1 ~ 5
) {
}