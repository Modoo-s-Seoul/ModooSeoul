package online.ft51land.modooseoul.utils.error.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Getter
@RequiredArgsConstructor
public enum ErrorMessage {

    // 에러 메시지 추가하면 됩니다.
    ROOMS_NOT_FOUND(NOT_FOUND, "해당 방을 찾을 수 없습니다."),
    PLAYER_NOT_FOUND(NOT_FOUND, "해당 플레이어를 찾을 수 없습니다.");

    private final int code;
    private final String phrase;

    ErrorMessage(HttpStatus code, String phrase) {
        this.code = code.value();
        this.phrase = phrase;
    }
}