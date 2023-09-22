package online.ft51land.modooseoul.domain.player.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.news.entity.News;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerArrivalBoardMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerDiceMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerReadyInfoMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerNewsMessage;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerNewsRequestDto;
import online.ft51land.modooseoul.domain.player.dto.response.PlayerJoinResponseDto;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class PlayerService {

    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final BoardStatusRepository boardStatusRepository;

    // playerId 로 Player 객체 얻어오는 메서드
    public Player getPlayerById(String playerId) {
        return playerRepository.findById(playerId)
                               .orElseThrow(() -> new BusinessException(ErrorMessage.PLAYER_NOT_FOUND));
    }

    // 방 참가 플레이어 정보 보내주기
    public List<PlayerReadyInfoMessage> getPlayersInfoForRoom(Game game) {
        // Message 만들기
        List<PlayerReadyInfoMessage> message = new ArrayList<>();
        List<String> players = game.getPlayers();

        for (String playerId : players) {
            Player player = getPlayerById(playerId);
            message.add(PlayerReadyInfoMessage.of(player));
        }
        return message;
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

    // 플레이어 참가
    public PlayerJoinResponseDto joinGame(PlayerJoinRequestDto playerJoinRequestDto) {

        // 1. 방이 존재하는지 확인
        Game game = gameRepository.findById(playerJoinRequestDto.gameId())
                                  .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

        // 2. 대기 중인 방인지 확인
        if (game.getIsStart()) {
            throw new BusinessException(ErrorMessage.GAME_ALREADY_START);
        }

        // 3. 참여자 정원이 다 찼는지 확인
        if (game.getPlayers() != null && game.getPlayers().size() >= 4) {
            throw new BusinessException(ErrorMessage.GAME_ALREADY_FULL);
        }

        // 4. 해당방에 중복된 닉네임이 있는지 확인
        List<String> players = game.getPlayers();
        for (String id : players) {
            //이미 참여중인 플레이어들의 id를 받아서 player 받아오기
            Player player = playerRepository.findById(id)
                    .orElseThrow(() -> new BusinessException(ErrorMessage.PLAYER_NOT_FOUND));
            
            if (player.getNickname().equals(playerJoinRequestDto.nickname())) {
                throw new BusinessException(ErrorMessage.DUPLICATE_PLAYER_NICKNAME);
            }
            
        }

        // 중복되지 않으면 사용자를 생성 후
        Player joinPlayer = playerRepository.save(playerJoinRequestDto.toPlayer());
        
        // 방 참여 ( 방 players에 사용자 pk 추가)
        game.addPlayer(joinPlayer);

        // 수정된 게임정보 수정
        gameRepository.save(game);
        
        // 프론트에서 구독을 위한 새로운 플레이어의 id를 response
        return PlayerJoinResponseDto.of(joinPlayer);
    }

    // 주사위 굴리기
    public PlayerDiceMessage rollDice(String playerId) {
        // 주사위 굴린 플레이어
        Player rolledPlayer = getPlayerById(playerId);

        Game game = gameRepository.findById(rolledPlayer.getGameId())
                .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

        // 턴 정보 확인
        if(rolledPlayer.getTurnNum() != game.getTurnInfo()){
            // 주사위 던지기를 요청한 플레이의 턴 순서와 현재 게임의 턴 순서가 맞지 않으면 예외처리
            throw  new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
        }

        // 랜덤 숫자 생성
        Random diceRoller = new Random();
        Long one = diceRoller.nextLong(6) + 1;
        Long two = diceRoller.nextLong(6) + 1;

        // 두 개의 눈금이 같을 경우
        if (one.equals(two)) {
            rolledPlayer.updateDouble(!rolledPlayer.getIsDouble());
        }
        else {
            rolledPlayer.updateDouble(false);
        }

        // 주사위 얼마 나왔는지 저장
        rolledPlayer.updateDice(one + two);

        // 어디로 이동했는지 저장
        Long bef = rolledPlayer.getCurrentBoardIdx();
        Long aft = (bef + (one + two)) % 32;
        rolledPlayer.playerMove(aft);

        // 월급 받았는지 안 받았는지 여부 저장
        Boolean isSalary = bef > aft;
        if(bef > aft){
            rolledPlayer.getSalary();
        }

        // DB 갱신
        playerRepository.save(rolledPlayer);

        // 메세지 가공 후 리턴
        return (PlayerDiceMessage.of(one, two, rolledPlayer, isSalary));
    }

    // 플레이어 뉴스 선택
    public PlayerNewsMessage chooseNews(Game game, PlayerNewsRequestDto playerNewsRequestDto) {
        // 해당 뉴스 내용 가져오기
        Long currentRound = playerNewsRequestDto.currentRound();
        Long cardIdx = playerNewsRequestDto.cardIdx();
        News news = game.getNews().get((int)((currentRound - 1) * 4 + (cardIdx - 1)));

        // 메시지 가공 후 리턴
        return PlayerNewsMessage.of(news);
    }

    // 플레이어 방 나가기
    public void leaveGame(Game game, Player player) {
        // 게임에서 플레이어 제외
        game.getPlayers().remove(player.getId());

        // 만약 남은 플레이어가 없는 경우 방 삭제
        if (game.getPlayers().isEmpty()) {
            gameRepository.delete(game);
        }
        else {
            gameRepository.save(game);
        }

        // 플레이어 레포지토리에서 플레이어 제외
        playerRepository.delete(player);
    }

    public Long passTurn (Player player){
        Game game = gameRepository.findById(player.getGameId())
                .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

        Long nextTurn = game.passTurn();
        gameRepository.save(game);
        return nextTurn;
    }

    public PlayerArrivalBoardMessage<?> arrivalBoardInfo(Player player) {

        String curBoardId = player.getGameId()+"@"+player.getCurrentBoardIdx();

        BoardStatus boardStatus = boardStatusRepository.findById(curBoardId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));
        //지역구 - 빈땅
        //플레이어의 아이디랑 현재 플레이어 위치한 보드의 ownerId가 같으면
        if(player.getId().equals(boardStatus.getOwnerId())) {
            return PlayerArrivalBoardMessage.of("zz","zz");
        }
        //지역구 - 내땅
        //지역구 - 남땅
        //찬스카드
        //특수칸 - 시작점
        //특수칸 - 감옥
        //특수칸 - 오일랜드
        //특수칸 - 지하철
        //특수칸 - 국세청
        return PlayerArrivalBoardMessage.of("zz","zz");
    }
}
