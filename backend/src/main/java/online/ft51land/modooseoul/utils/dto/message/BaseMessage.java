package online.ft51land.modooseoul.utils.dto.message;

public record BaseMessage<T>(Long messageNum, T message) {

    public static <T> BaseMessage<T> baseMessage(Long messageNum, T message){
        return new BaseMessage<>(messageNum, message);
    }
}
