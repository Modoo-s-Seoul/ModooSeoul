package online.ft51land.modooseoul.domain.room.dto.request;

import online.ft51land.modooseoul.domain.room.entity.Room;

public record RoomCreateRequestDto(
        String name,
        Boolean isStart

) {
    public Room toRoom(){
        return new Room(
                this.name,
                this.isStart
        );
    }
}
