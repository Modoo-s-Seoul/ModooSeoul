package online.ft51land.modooseoul.domain.game.service;

import lombok.RequiredArgsConstructor;
import online.ft51land.modooseoul.domain.game.dto.response.GameCreateResponseDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class GameService {

    private final GameRepository gameRepository;

    private final PlayerRepository playerRepository;
    private final PlayerService playerService;

    public Game getGameById(String gameId) {
        return gameRepository.findById(gameId)
                             .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));
    }

    public GameCreateResponseDto create() {
        Game game = gameRepository.save(new Game());
        System.out.println(game.toString());
        return GameCreateResponseDto.of(game);
    }

    public Boolean gameStart(Game game) {

        // 게임 시작 가능 여부 확인
        List<Player> players = new ArrayList<>();
        int readyCnt = 0;

        for (String playerId : game.getPlayers()) {
            Player player = playerService.getPlayerById(playerId);

            if (player.getIsReady()) { // 준비 안한 플레이어가 있으면
                readyCnt++;
            }

            players.add(player);
        }
        if (readyCnt <= 0 || (players.size() - 1 != readyCnt))  {
            // 로직 보강 필요
            return false;
        }

        // 방 초기 세팅
        game.gameStart();
        gameRepository.save(game);

        // 플레이어 초기 세팅
        for (Player player : players) {
            player.gameStart();
            playerRepository.save(player);
        }

        /*
          게임 초기 세팅
          1. 방
          2. 플레이어들
         */

        return true;
    }
}
