package online.ft51land.modooseoul.utils.error.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum ErrorMessage {

    // 에러 메시지 추가하면 됩니다.
    PLAYER_NOT_FOUND(NOT_FOUND, "해당 플레이어를 찾을 수 없습니다."),
    BOARD_NOT_FOUND(NOT_FOUND, "해당 땅 정보를 찾을 수 없습니다."),
    STOCK_NOT_FOUND(NOT_FOUND, "해당 주식을 찾을 수 없습니다."),
    BUILDING_NOT_FOUND(NOT_FOUND, "해당 건물 정보를 찾을 수 없습니다."),
    STOCK_BOARD_NOT_FOUND(NOT_FOUND, "해당 주식보드를 찾을 수 없습니다"),
    CHANCE_NOT_FOUND(NOT_FOUND, "해당 찬스카드 정보를 찾을 수 없습니다."),
    INTERVAL_SERVER_ERROR(INTERNAL_SERVER_ERROR, "요청을 처리하는 과정에서 서버가 예상하지 못한 오류가 발생하였습니다."),
    GAME_NOT_FOUND(NOT_FOUND, "해당 방을 찾을 수 없습니다."),
    GAME_ALREADY_FULL(FORBIDDEN, "해당 방의 정원이 이미 가득 찼습니다."),
    GAME_ALREADY_START(FORBIDDEN,"이미 게임을 시작한 방입니다."),
    DUPLICATE_PLAYER_NICKNAME(CONFLICT, "이미 사용 중인 닉네임입니다."),
    BAD_SEQUENCE_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 순서의 요청입니다."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    TIMER_EXPIRED(FORBIDDEN,"타이머가 만료되었습니다."),
    TIMER_ALREADY_ACTIVATED(FORBIDDEN, "타이머가 이미 활성화 되어 있습니다."),

    CANNOT_BUY_STOCK(FORBIDDEN, "보유한 현금이 부족하여 주식을 구매할 수 없습니다."),
    CANNOT_SELL_STOCK(FORBIDDEN, "보유한 주식이 부족하여 주식을 판매할 수 없습니다."),
    CANNOT_PAY_TAX(FORBIDDEN, "보유한 현금이 부족하여 세금을 납부할 수 없습니다.");

    private final int code;
    private final String phrase;

    ErrorMessage(HttpStatus code, String phrase) {
        this.code = code.value();
        this.phrase = phrase;
    }
}