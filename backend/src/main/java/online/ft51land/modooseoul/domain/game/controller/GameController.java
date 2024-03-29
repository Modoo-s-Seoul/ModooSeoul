package online.ft51land.modooseoul.domain.game.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.response.GameCreateResponseDto;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.utils.dto.response.BaseResponseDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/games")
public class GameController {

    private final GameService gameService;

    /*
    방 생성
     */
    @PostMapping
    public BaseResponseDto<GameCreateResponseDto> createGame(){
        return BaseResponseDto.ok(gameService.create());
    }
}
