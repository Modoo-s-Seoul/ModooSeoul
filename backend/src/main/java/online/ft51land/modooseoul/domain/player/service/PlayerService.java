package online.ft51land.modooseoul.domain.player.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerDiceMessage;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.player.dto.response.PlayerJoinResponseDto;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class PlayerService {

    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;

    // playerId 로 Player 객체 얻어오는 메서드
    public Player getPlayerById(String playerId) {
        return playerRepository.findById(playerId)
                               .orElseThrow(() -> new BusinessException(ErrorMessage.PLAYER_NOT_FOUND));
    }

    // 플레이어 레디 / 취소 할 시 레포지토리 상태 변경해주기
    public Player playerReady(String playerId) {
        // 레디 / 취소 요청한 플레이어 객체
        Player readyPlayer = getPlayerById(playerId);

        // 레디 상태 변경
        readyPlayer.toggleReadyStatus();

        // 레포지토리에 갱신
        playerRepository.save(readyPlayer);

        return readyPlayer;
    }

    public PlayerJoinResponseDto joinGame(PlayerJoinRequestDto playerJoinRequestDto) {

        // 1. 방이 존재하는지 확인
        Game game = gameRepository.findById(playerJoinRequestDto.gameId())
                                  .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

        // 2. 대기 중인 방인지 확인
        if (game.getIsStart()) {
            throw new BusinessException(ErrorMessage.GAME_ALREADY_START);
        }

        // 3. 참여자 정원일 다 찼는지 확인
        if (game.getPlayers() != null && game.getPlayers().size() >= 4) {
            throw new BusinessException(ErrorMessage.GAME_ALREADY_FULL);
        }

        // 4. 해당방에 중복된 닉네임이 있는지 확인
        List<String> players = game.getPlayers();
        for (String nickname : players) {
            if (nickname.equals(playerJoinRequestDto.nickname())) {
                throw new BusinessException(ErrorMessage.DUPLICATE_PLAYER_NICKNAME);
            }
        }

        // 중복되지 않으면 사용자를 생성 후
        Player player = playerRepository.save(playerJoinRequestDto.toPlayer());

        // 방 참여 ( 방 players에 사용자 pk 추가)
        game.addPlayer(player);

        gameRepository.save(game);

        return PlayerJoinResponseDto.of(player);
    }

    /*
        주사위 굴리기
     */
    public PlayerDiceMessage rollDice(String playerId) {
        // 주사위 굴린 플레이어
        Player rolledPlayer = getPlayerById(playerId);
        Random diceRoller = new Random();
        Long one = diceRoller.nextLong(6) + 1;
        Long two = diceRoller.nextLong(6) + 1;
        if (one.equals(two)) {
            /*
                같은 경우에
                false 면 true 전달
                true 면 false 전달
             */
            rolledPlayer.updateDouble(!rolledPlayer.getIsDouble());
        }
        else {
            rolledPlayer.updateDouble(false);
        }
        rolledPlayer.updateDice(one + two);
        playerRepository.save(rolledPlayer);

        // 메세지 가공 후 리턴
        return (PlayerDiceMessage.of(one, two, rolledPlayer));
    }
}
