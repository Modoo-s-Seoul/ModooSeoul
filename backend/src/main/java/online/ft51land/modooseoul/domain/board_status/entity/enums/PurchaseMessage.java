package online.ft51land.modooseoul.domain.board_status.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PurchaseMessage {


    // 땅구매
    CASH_INSUFFICIENT("구매할 현금이 부족합니다."),
    GROUND_OWNER_EXISTS("땅의 소유자가 있습니다."),
    GROUND_PURCHASE_SUCCESS("땅 구매에 성공하였습니다."),

    // 건물 구매
    NOT_PLAYER_GROUND("플레이어의 땅이 아닙니다."),
    INVALID_LOCATION("유효하지 않은 건물 위치입니다."),
    INVALID_BUILDING("유효하지 않은 건물입니다."),
    BUILDING_EXISTS("이미 건물이 있는 위치입니다."),
    BUILDING_PURCHASE_SUCCESS("건물 구매에 성공하였습니다.");



    private final String message;

    public String getMessage() {
        return message;
    }

}
