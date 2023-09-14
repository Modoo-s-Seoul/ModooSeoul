package online.ft51land.modooseoul.domain.room.service;

import lombok.RequiredArgsConstructor;
import online.ft51land.modooseoul.domain.room.dto.response.RoomCreateResponseDto;
import online.ft51land.modooseoul.domain.room.entity.Room;
import online.ft51land.modooseoul.domain.room.repository.RoomRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomCreateResponseDto create() {
        Room room = roomRepository.save(new Room());
        System.out.println(room.toString());
        return RoomCreateResponseDto.of(room);
    }

    public Room gameStart(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorMessage.ROOM_NOT_FOUND));

        room.gameStart();

        roomRepository.save(room);

        /**
         * 게임 초기 세팅
         * 1. 방
         * 2. 플레이어들
         */

        return room;
    }
}
