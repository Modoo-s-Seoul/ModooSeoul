package online.ft51land.modooseoul.domain.player.dto.message;

public record PlayerArrivalBoardMessage<T>(String board, T data) {
    public static <T> PlayerArrivalBoardMessage <T> of(String board, T data) {
        return new PlayerArrivalBoardMessage<>(board,data);
    }
}
