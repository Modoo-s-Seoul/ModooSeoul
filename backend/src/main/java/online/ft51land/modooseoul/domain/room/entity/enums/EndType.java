package online.ft51land.modooseoul.domain.room.entity.enums;

public enum EndType {
    BANKRUPTCY("파산"),
    END_OF_TURN("턴종료");
    private final  String message;

    EndType(String message) {
        this.message = message;
    }

    public String getMessage(){
        return message;
    }


}
