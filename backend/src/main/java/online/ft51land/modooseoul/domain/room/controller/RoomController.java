package online.ft51land.modooseoul.domain.room.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.room.dto.response.RoomCreateResponseDto;
import online.ft51land.modooseoul.domain.room.service.RoomService;
import online.ft51land.modooseoul.utils.dto.response.BaseResponseDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;


    /*
    방 생성
     */
    @PostMapping
    public BaseResponseDto<RoomCreateResponseDto> createRoom(){
        return BaseResponseDto.ok(roomService.create());
    }

    /*
    방 참여
     */
//    @PostMapping("/{roomId}")
//    public BaseResponseDto<Room>
}
