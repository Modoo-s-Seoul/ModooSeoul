package online.ft51land.modooseoul.domain.room.dto.response;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.room.entity.Room;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record RoomCreateResponseDto(
        String id,
        List<Player> players,
        Boolean isStart,
        LocalDateTime createDate
) {
    public static RoomCreateResponseDto of(Room room){
        return RoomCreateResponseDto.builder()
                .id(room.getId())
                .players(room.getPlayers())
                .isStart(room.getIsStart())
                .createDate(room.getCreatedDate())
                .build();
    }
}


