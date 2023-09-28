package online.ft51land.modooseoul.domain.player.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board.entity.enums.BoardType;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.domain.news.entity.News;
import online.ft51land.modooseoul.domain.player.dto.message.*;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerNewsRequestDto;
import online.ft51land.modooseoul.domain.player.dto.response.PlayerJoinResponseDto;
import online.ft51land.modooseoul.domain.player.dto.response.PlayerPayResponseDto;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
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
        if(!rolledPlayer.getTurnNum().equals(game.getTurnInfo())){
            // 주사위 던지기를 요청한 플레이의 턴 순서와 현재 게임의 턴 순서가 맞지 않으면 예외처리
            throw  new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
        }

        // 랜덤 숫자 생성
        Random diceRoller = new Random();
        diceRoller.setSeed(System.currentTimeMillis());
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
        Long aft = (bef + (one + two)) % 32; // 1 ~ 32
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

        gameRepository.save(game);


        // 메시지 가공 후 리턴
        return PlayerNewsMessage.of(news);
    }


    public PlayerNewsMessage autoPlayerChooseNews(Game game, String playerId) {
        Player player = getPlayerById(playerId);

        if(!player.getIsFinish()) { // 뉴스를 뽑지 않았다면
            Random random = new Random();
            random.setSeed(System.currentTimeMillis());
            Long cardIdx = random.nextLong(4)+1;
            PlayerNewsMessage message  = chooseNews(game, PlayerNewsRequestDto.of(game.getCurrentRound(), cardIdx));
            return  message;
        }

        return  null;
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

    @Transactional
    public PlayerArrivalBoardMessage<?> arrivalBoardInfo(String playerId) {

        Player player = getPlayerById(playerId);
        String curBoardId = player.getGameId()+"@"+player.getCurrentBoardIdx();

        BoardStatus boardStatus = boardStatusRepository.findById(curBoardId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));
        //지역구 - 빈땅
        if(boardStatus.getOwnerId() == null && boardStatus.getBoardType() == BoardType.DISTRICT) {
            return PlayerArrivalBoardMessage.of("빈 땅",boardStatus);
        }
        //지역구 - 내땅
        if(player.getId().equals(boardStatus.getOwnerId()) && boardStatus.getBoardType() == BoardType.DISTRICT) {
            return PlayerArrivalBoardMessage.of("플레이어 소유 땅",boardStatus);
        }
        //지역구 - 남땅
        if(!player.getId().equals(boardStatus.getOwnerId()) && boardStatus.getBoardType() == BoardType.DISTRICT) {
            tollPayment(boardStatus, playerId, boardStatus.getOwnerId());
            PlayerPayResponseDto playerPayResponseDto = PlayerPayResponseDto.of(boardStatus,getPlayerById(playerId),getPlayerById(boardStatus.getOwnerId()));
            return PlayerArrivalBoardMessage.of("다른 플레이어 소유 땅",playerPayResponseDto);
        }
        //찬스카드
        if(boardStatus.getBoardType() == BoardType.CHANCE) {
            return PlayerArrivalBoardMessage.of("찬스 카드 도착",boardStatus);
        }

        if(boardStatus.getBoardType() == BoardType.SPECIAL) {
            return specialBoard(boardStatus);
        }

        return null;
    }

    @Transactional
    public PlayerArrivalBoardMessage<BoardStatus> specialBoard(BoardStatus boardStatus) {
        //특수칸 - 시작점
        if(boardStatus.getSpecialName().equals("출발지") && boardStatus.getBoardType() == BoardType.SPECIAL) {
            return PlayerArrivalBoardMessage.of("출발지 도착",boardStatus);
        }
        //특수칸 - 감옥
        if(boardStatus.getSpecialName().equals("감옥") && boardStatus.getBoardType() == BoardType.SPECIAL) {
            return PlayerArrivalBoardMessage.of("감옥 도착",boardStatus);
        }
        //특수칸 - 오일랜드
        if(boardStatus.getSpecialName().equals("FT OilLand") && boardStatus.getBoardType() == BoardType.SPECIAL) {
            return PlayerArrivalBoardMessage.of("오일랜드 도착",boardStatus);
        }
        //특수칸 - 지하철
        if(boardStatus.getSpecialName().equals("지하철") && boardStatus.getBoardType() == BoardType.SPECIAL) {
            return PlayerArrivalBoardMessage.of("지하철 도착",boardStatus);
        }
        //특수칸 - 국세청 board 업데이트 되면 만들기
        return null;
    }

    @Transactional
    public void tollPayment(BoardStatus boardStatus, String playerId, String ownerId) {
        //통행료 계산 -> 나중에 플레이어의 보유 자산만큼 증가하는 로직 필요
        Long toll = boardStatus.getPrice() * boardStatus.getSynergy() * boardStatus.getOil();
        Player payPlayer = getPlayerById(playerId);
        Player ownerPlayer = getPlayerById(ownerId);

        if(toll > payPlayer.getCash()+payPlayer.getStockMoney()) {
            //파산 경우
            if(payPlayer.getEstates() != null) {
                for (Long estate : payPlayer.getEstates()) {
                    BoardStatus sellBoard = boardStatusRepository.findById(payPlayer.getGameId()+"@"+estate)
                            .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));
                    sellBoard.resetBoard();
                    boardStatusRepository.save(sellBoard);
                }
            }
            payPlayer.bankrupt();
            playerRepository.save(payPlayer);
            ownerPlayer.receiveToll(toll);
            playerRepository.save(ownerPlayer);

            return;
        }

        if(toll <= payPlayer.getCash()+payPlayer.getStockMoney() && payPlayer.getCash() < toll) {
            //현금 + 주식몰수한 돈으로 해결 가능한 경우
            //나중에 플레이어 주식 redis 삭제
            payPlayer.sellAllStock();
        }

        //통행료 지불
        payPlayer.payToll(toll);
        ownerPlayer.receiveToll(toll);
        playerRepository.save(payPlayer);
        playerRepository.save(ownerPlayer);
    }

    public Long playerActionFinish(Player player, Game game){
        /**
         * 패스를 요청한 플레이어의 isFinish 확인
         * isPass가 false 이면 true 로 바꾸기
         * Game의 playerPasscnt 증가
         *
         */

        // 공통턴이 아닐때 pass 요청을 하면 에러
        if(game.getTurnInfo() < game.getPlayers().size()){
          throw new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
        }

        // 이미 행동을 완료한 플레이어가 다시 완료 했을 경우 예외 처리
        if(player.getIsFinish()){
            throw new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
        }


        player.finish();
        game.addFinishPlayerCnt();

        playerRepository.save(player);
        gameRepository.save(game);


        return game.getFinishedPlayerCnt();
    }

    public PlayerTaxMessage taxPayment(Player player) {
        if (player.getCash() < player.getTax()) {
            return PlayerTaxMessage.error(ErrorMessage.CANNOT_PAY_TAX.getPhrase());
        }
        player.taxPayment();
        playerRepository.save(player);
        return PlayerTaxMessage.of(player);
    }

    public PlayerReportMessage reportPlayer(Player player, String nickname) {

        player.setReporteePlayerName(nickname);

        playerRepository.save(player);

        return PlayerReportMessage.of(player);

    }
}
