package online.ft51land.modooseoul.domain.game.service;

import lombok.RequiredArgsConstructor;
import online.ft51land.modooseoul.domain.game.dto.response.GameCreateResponseDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GameService {

    private final GameRepository gameRepository;

    public Game getGameById(String gameId) {
        return gameRepository.findById(gameId)
                             .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));
    }

    public GameCreateResponseDto create() {
        Game game = gameRepository.save(new Game());
        System.out.println(game.toString());
        return GameCreateResponseDto.of(game);
    }

    public Game gameStart(String gameId) {
        // 방 초기 세팅
        Game game = getGameById(gameId);
        game.gameStart();
        gameRepository.save(game);

        // 플레이어 초기 세팅

        /**
         * 게임 초기 세팅
         * 1. 방
         * 2. 플레이어들
         */

        return game;
    }
}
