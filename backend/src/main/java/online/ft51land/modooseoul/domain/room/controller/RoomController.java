package online.ft51land.modooseoul.domain.room.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.room.dto.response.RoomCreateResponseDto;
import online.ft51land.modooseoul.domain.room.service.RoomService;
import online.ft51land.modooseoul.utils.dto.response.BaseResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final RoomService roomService;


    /*
    방 생성
     */
    @PostMapping
    public BaseResponseDto<RoomCreateResponseDto> createRoom(){
        return BaseResponseDto.ok(roomService.create());
    }

    @GetMapping("/test")
    public String test() {
        return "Test success";
    }
}
