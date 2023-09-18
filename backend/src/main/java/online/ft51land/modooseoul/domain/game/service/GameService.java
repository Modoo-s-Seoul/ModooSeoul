package online.ft51land.modooseoul.domain.game.service;

import lombok.RequiredArgsConstructor;
import online.ft51land.modooseoul.domain.game.dto.message.GameStartMessage;
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
import java.util.Random;

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
        return GameCreateResponseDto.of(game);
    }

    public GameStartMessage gameStart(Game game) {

        // 게임 시작 가능 여부 확인
        List<Player> players = new ArrayList<>();
        int readyCnt = 0;

        for (String playerId : game.getPlayers()) {
            Player player = playerService.getPlayerById(playerId);

            // 레디한 플레이어 몇 명인지 체크
            if (player.getIsReady()) {
                readyCnt++;
            }

            players.add(player);
        }

        // 방장만 있을 경우
        if (players.size() == 1) {
            return GameStartMessage.of(false, "플레이어가 최소 2명 이상이어야 합니다.");
        }

        // 준비 안 한 플레이어가 있는 경우
        if (players.size() -1 != readyCnt) {
            return GameStartMessage.of(false, "플레이어가 모두 레디해야 합니다.");
        }

        // 방 초기 세팅
        game.gameStart();
        gameRepository.save(game);

        // 플레이어 초기 세팅
        for (Player player : players) {
            player.gameStart();
            playerRepository.save(player);
        }

        return GameStartMessage.of(true, "게임 시작!");
    }

    /* 게임 선 세팅
           하나 랜덤으로 정해서 선 주고 그 플레이어 기준으로 오름차순으로 순서 부여 */
    public void sequencePlayer(Game game) {

        Random random = new Random();
        int playerNum = game.getPlayers().size();
        int firstPlayer = random.nextInt(playerNum); // 선 플레이어 : 0~n-1 까지의 수

        // 선 플레이어를 기준으로 오름차순으로 순서 부여
        for(int i = 0; i < playerNum; i++) {
            int currentPlayer = (firstPlayer + i) % playerNum;
            game.sequencePlayer(currentPlayer);
        }
        gameRepository.save(game);

    }
}
