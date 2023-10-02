package online.ft51land.modooseoul.domain.game.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board.entity.Board;
import online.ft51land.modooseoul.domain.board.repository.BoardRepository;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.game.dto.message.GameEndMessage;
import online.ft51land.modooseoul.domain.game.dto.message.GameRoundStartMessage;
import online.ft51land.modooseoul.domain.game.dto.message.GameStartMessage;
import online.ft51land.modooseoul.domain.game.dto.response.GameCreateResponseDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.entity.enums.EndType;
import online.ft51land.modooseoul.domain.game.entity.enums.TimerType;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.game_stock.repository.GameStockRepository;
import online.ft51land.modooseoul.domain.messagenum.entity.MessageNum;
import online.ft51land.modooseoul.domain.messagenum.repository.MessageNumRepository;
import online.ft51land.modooseoul.domain.news.entity.News;
import online.ft51land.modooseoul.domain.news.entity.enums.NewsType;
import online.ft51land.modooseoul.domain.news.repository.NewsRepository;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerInGameInfoMessage;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerPrisonMessage;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.player.service.PlayerService;
import online.ft51land.modooseoul.domain.stock.entity.Stock;
import online.ft51land.modooseoul.domain.stock.repository.StockRepository;
import online.ft51land.modooseoul.domain.stock_board.entity.StockBoard;
import online.ft51land.modooseoul.domain.stock_board.repository.StockBoardRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class GameService {

    private final PlayerService playerService;

    private final GameRepository gameRepository;
    private final MessageNumRepository messageNumRepository;
    private final PlayerRepository playerRepository;
    private final NewsRepository newsRepository;
    private final BoardRepository boardRepository;
    private final BoardStatusRepository boardStatusRepository;
    private final GameStockRepository gameStockRepository;
    private final StockRepository stockRepository;
    private final StockBoardRepository stockBoardRepository;



    public Game getGameById(String gameId) {
        return gameRepository.findById(gameId)
                             .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));
    }

    public GameCreateResponseDto create() {
        Game game = gameRepository.save(new Game());
        messageNumRepository.save(new MessageNum(game.getId()));
        return GameCreateResponseDto.of(game);
    }

    public GameStartMessage gameStart(Game game, List<Player> players) {

        log.info("플레이어 리스트 = {}, {}", players.get(0), players.get(1));
        // 게임 시작 가능 여부 확인
        int readyCnt = 0;


        for (Player player : players) {
            log.info("player = {}", player);
            // 레디한 플레이어 몇 명인지 체크
            if (player.getIsReady()) {
                readyCnt++;
            }
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
        game.setBasicInfo(); // 방 기본 정보
        sequencePlayer(game); // 선 정하기
        setRandomStocks(game); // 주식 3개 정하기
        setNews(game); // 뉴스 저장
        setGameStocks(game); // 주식 초기값 저장
        setBoard(game);
        gameRepository.save(game);

        // 플레이어 초기 세팅
        for (int i = 0; i < players.size(); i++) {
            Player player = players.get(i);
            player.playerInit(Long.valueOf(i));
            playerRepository.save(player);
        }

        // 플레이어 주식 보드 세팅
        for (Player player : players) {
            StockBoard stockBoard = new StockBoard(player.getId());
            stockBoard.stockBoardinit(game);
            stockBoardRepository.save(stockBoard);
            player.setStockBoardId(stockBoard.getId());
            playerRepository.save(player);
        }

        return GameStartMessage.of(true, "게임 시작!");
    }

    private void setBoard(Game game) {
        List<Board> boardList = boardRepository.findAll();

        for(Board board : boardList){
            boardStatusRepository.save(new BoardStatus(game.getId(), board));
        }
    }

    // 주식 세팅
    public void setGameStocks(Game game) {
        List<Long> stocksIds = game.getStocks();
        for (Long stockId : stocksIds) {
            Stock stock = stockRepository
                    .findById(stockId)
                    .orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_NOT_FOUND));
            GameStock gameStock = new GameStock(stock, game.getId());
            gameStockRepository.save(gameStock);
        }
    }

    public void setRandomStocks(Game game) {
        // random generator
        Random random = new Random();

        // 주식 5개 중에 3개 뽑아서 game.stock 에 저장
        Set<Long> selectedIdx = new HashSet<>();
        List<Long> selectedId = new ArrayList<>();
        while (selectedIdx.size() < 3) {
            Long num = random.nextLong(5) + 1;
            if (selectedIdx.add(num)) {
                selectedId.add(num);
            }
        }
        game.setStocks(selectedId);
    }

    /* 게임 선 세팅
          player 리스트 랜덤으로 섞어서 다시 저장*/
    public void sequencePlayer(Game game) {

        List<String> players = game.getPlayers();
        Collections.shuffle(players); //리스트 순서 섞기
        game.setSequencePlayer(players);
    }

    public void setNews(Game game) {
        // 최종 저장본
        List<List<News>> news = new ArrayList<>();
        List<Long> stockIds = game.getStocks();

        // 선정된 주식들 일단 섞어서 저장
        // 행렬 뒤집히기 전에 리스트
        List<List<News>> befTranspose = new ArrayList<>();
        for (Long StockId : stockIds) {
            List<News> newsListByStockId = newsRepository.findByStockId(StockId);
            Collections.shuffle(newsListByStockId);
            befTranspose.add(newsListByStockId);
        }
        befTranspose.add(newsRepository.findByStockId(6L)); // 꽝 추가

        // 행렬 뒤집고, 각 라운드별로 섞기
        for (int i = 0; i < 10; i++) {
            news.add(new ArrayList<>());
            for (int j = 0; j < 4; j++) {
                news.get(i).add(befTranspose.get(j).get(i));

            }
            Collections.shuffle(news.get(i));
        }
        game.setNews(news);
    }

    public List<PlayerInGameInfoMessage> getPlayersInfo(List<Player> players) {
        List<PlayerInGameInfoMessage> playersInfo = new ArrayList<>();

        for (Player player : players) {
            playersInfo.add(PlayerInGameInfoMessage.of(player));
        }

        return playersInfo;
    }

    public GameRoundStartMessage startRound(Game game, List<Player> players) {
        game.roundStart(game.getCurrentRound() + 1);

        // 전라운드 주식 보유금 저장 (가격 변동 후 주식 보유금은 player 객체에 넣음)
        for (Player player : players) {
            StockBoard stockBoard = stockBoardRepository
                    .findById(player.getId() + "@stockBoard")
                    .orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_BOARD_NOT_FOUND));
            stockBoard.nextRound(player);
            stockBoardRepository.save(stockBoard);
        }

        // 주식 가격 변동
        List<GameStock> gameStocks = setNextRoundStockPrice(game);
        gameRepository.save(game);

        // 플레이어 다음 라운드 세팅
        for (Player player : players) {
            Long stockMoney = getNextRoundPlayerStockMoney(player);
            player.setNextRound(stockMoney);
            // 배당금 수령
            player.setDevidend();
            // 세금 미납액 증가
            player.setTax(player.getTax() + (player.getTax() / 1000) * 100);
            // 저장
            playerRepository.save(player);
        }

        // 메시지 가공
        return GameRoundStartMessage.of(game, gameStocks);
    }

    public Long getNextRoundPlayerStockMoney(Player player) {
        Long stockMoney = 0L;

        // 플레이어 소유 주식 보드 가져오기
        StockBoard stockBoard = stockBoardRepository
                .findById(player.getId() + "@stockBoard")
                .orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_BOARD_NOT_FOUND));


        for (int i = 0; i < stockBoard.getGameStockIds().size(); i++) {
            // 주식보드에 있는 게임 주식 아이디를 이용해서 게임주식 가져오기
            String gameStockId = stockBoard.getGameStockIds().get(i);

            GameStock gameStock = gameStockRepository
                    .findById(gameStockId)
                    .orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_NOT_FOUND));

            // 게임주식에 있는 가격과 주식보드에 있는 보유량을 곱해서 더해주기
            stockMoney += gameStock.getStockPrice() * stockBoard.getStockAmounts().get(i);
        }

        return stockMoney;
    }

    public List<GameStock> setNextRoundStockPrice(Game game) {
        int passFlag = 0;
        List<GameStock> gameStocks = new ArrayList<>();
        for (int i = 0; i < 4; i++) {

            // 지금 라운드의 모든 뉴스들 가져오기
            News news = game.getNews().
                    get((int)((game.getCurrentRound() - 1) * 4 + i));

            // 꽝일 경우 그냥 넘김
            if (news.getStock().getId() == 6) {
                passFlag = 1;
                continue;
            }

            // 주식 가져오기
            GameStock gameStock = gameStockRepository
                    .findById(game.getId() + "@" + game.getStocks().get(i - passFlag))
                    .orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_NOT_FOUND));

            Long price = gameStock.getStockPrice(); // 전 라운드 가격
            if (game.getCurrentRound() == 1) {
                gameStocks.add(gameStock);
                continue;
            }
            NewsType newsType = news.getNewsType(); // 증감 여부
            Long percent = news.getPercent(); // 퍼센트

            // 계산
            long calPrice = price * percent / 100; // maintain 은 percent 0이라 ㄱㅊ
            // 감소일 땐 -1 곱해주기
            if (newsType.equals(NewsType.DECREASE)) {
                calPrice *= (-1);
            }
            price += calPrice;

            // 100밑의 자리 버림
            price = (price / 100) * 100;

            // gameStock 에 저장
            gameStock.setStocksPrice(price);
            gameStockRepository.save(gameStock);

            gameStocks.add(gameStock);
        }
        return gameStocks;
    }

    public PlayerPrisonMessage setPlayerIsPrisoned(Player player) {
        player.setIsPrisoned(true);

	    return PlayerPrisonMessage.of(player);
    }

    public void passTurn(Game game) {
        game.passTurn();
        gameRepository.save(game);
    }

    public void startTimer(Game game, TimerType timerType) {
        game.startTimer(timerType);
        gameRepository.save(game);
    }


    public void expiredTimer(Game game) {
        game.expiredTimer();
        gameRepository.save(game);
    }

    @Transactional
    public GameEndMessage endGame(Game game, EndType endType) {
        List<Player> players = convertToPlayerList(game.getPlayers());
        game.setEndGame(endType,players.get(0).getId());
        gameRepository.save(game);
        return GameEndMessage.of(players);
    }

    private List<Player> convertToPlayerList(List<String> players) {
        List<Player> sortedPlayers = new ArrayList<>();

        for (String playerId : players) {
            Player player = playerService.getPlayerById(playerId);
            sortedPlayers.add(player);
        }
        return  sortToMoney(sortedPlayers);
    }

    private List<Player> sortToMoney(List<Player> players) {
        return players.stream()
                .sorted((player1, player2) -> {
                    long totalMoney1 = player1.getCash() + player1.getEstateMoney() + player1.getStockMoney();
                    long totalMoney2 = player2.getCash() + player2.getEstateMoney() + player2.getStockMoney();

                    return Long.compare(totalMoney2, totalMoney1);
                })
                .collect(Collectors.toList());
    }


    public void playersActionFinish(Game game) {
        // game 에 해당하는 모든 player pass init  , 타이머 종료
        List<Player> playerList = playerRepository.findAllByGameId(game.getId());

        for (Player player : playerList ){
            player.finishInit();
            playerRepository.save(player);
        }

        expiredTimer(game); // 타이머 만료
//        passTurn(game);
    }

    // 플레이에 참여하고 있는 플레이어의 수 -> 파산하지 않은 플레이어의 수
    public Long getPlayingPlayerCnt(Game game) {
        List<Player> players= playerRepository.findAllByGameId(game.getId());
        Long cnt = 0L;
        for (Player player:players ){
            if(!player.getIsBankrupt()){
                cnt ++;
            }
        }
        return cnt;
    }

}
