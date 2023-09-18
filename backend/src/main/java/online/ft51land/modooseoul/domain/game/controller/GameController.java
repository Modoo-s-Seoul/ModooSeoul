package online.ft51land.modooseoul.domain.game.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.dto.message.GameStartMessage;
import online.ft51land.modooseoul.domain.game.dto.request.GameStartRequestDto;
import online.ft51land.modooseoul.domain.game.dto.response.GameCreateResponseDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.service.GameService;
import online.ft51land.modooseoul.utils.dto.response.BaseResponseDto;
import online.ft51land.modooseoul.utils.websocket.WebSocketSendHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/games")
public class GameController {

    private final GameService gameService;
    private final WebSocketSendHandler webSocketSendHandler;

    /*
    방 생성
     */
    @PostMapping
    public BaseResponseDto<GameCreateResponseDto> createGame(){
        return BaseResponseDto.ok(gameService.create());
    }

    @GetMapping("/test")
    public String test() {
        return "Test success";
    }
}
