package online.ft51land.modooseoul.utils.dto.message;

public record BaseMessage<T>(Long messageNum, T data) {

    public static <T> BaseMessage<T> baseMessage(Long messageNum, T data){
        return new BaseMessage<>(messageNum, data);
    }
}
