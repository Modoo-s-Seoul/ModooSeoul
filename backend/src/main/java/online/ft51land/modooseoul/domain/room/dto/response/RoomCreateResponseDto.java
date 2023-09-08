package online.ft51land.modooseoul.domain.room.dto.response;

import lombok.Builder;
import online.ft51land.modooseoul.domain.room.entity.Room;

import java.time.LocalDateTime;

@Builder
public record RoomCreateResponseDto(
        Long id,
        String name,
        Boolean isStart,
        LocalDateTime createDateTime
) {
    public static RoomCreateResponseDto of(Room room){
        return RoomCreateResponseDto.builder()
                .id(room.getId())
                .name(room.getName())
                .isStart(room.getIsStart())
                .createDateTime(room.getCreatedDate())
                .build();
    }
}


