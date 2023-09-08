package online.ft51land.modooseoul.domain.room.service;

import lombok.RequiredArgsConstructor;
import online.ft51land.modooseoul.domain.room.dto.request.RoomCreateRequestDto;
import online.ft51land.modooseoul.domain.room.dto.response.RoomCreateResponseDto;
import online.ft51land.modooseoul.domain.room.entity.Room;
import online.ft51land.modooseoul.domain.room.repository.RoomRepository;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;
    public RoomCreateResponseDto create(RoomCreateRequestDto roomRequestDto) {
        Room room = roomRepository.save(roomRequestDto.toRoom());
        System.out.println(room.toString());
        return RoomCreateResponseDto.of(room);
    }
}
