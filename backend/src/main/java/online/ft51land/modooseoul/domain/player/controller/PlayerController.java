package online.ft51land.modooseoul.domain.player.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.player.dto.response.PlayerJoinResponseDto;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.dto.response.BaseResponseDto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/players")
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping("/join")
    public BaseResponseDto<PlayerJoinResponseDto> joinRoom(@RequestBody PlayerJoinRequestDto playerJoinRequestDto){
        return BaseResponseDto.ok(playerService.joinRoom(playerJoinRequestDto));
    }

}