package online.ft51land.modooseoul.utils.error.exception.custom;


import lombok.Getter;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;

@Getter
public class BusinessException extends RuntimeException {

    private final int code;

    public BusinessException(ErrorMessage errorMessage) {
        super(errorMessage.getPhrase());
        this.code = errorMessage.getCode();
    }
}
