package online.ft51land.modooseoul.domain.game.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board.entity.Board;
import online.ft51land.modooseoul.domain.board.repository.BoardRepository;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.game.dto.message.GameStartMessage;
import online.ft51land.modooseoul.domain.game.dto.response.GameCreateResponseDto;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.game_stock.repository.GameStockRepository;
import online.ft51land.modooseoul.domain.messagenum.entity.MessageNum;
import online.ft51land.modooseoul.domain.messagenum.repository.MessageNumRepository;
import online.ft51land.modooseoul.domain.news.entity.News;
import online.ft51land.modooseoul.domain.news.repository.NewsRepository;

import online.ft51land.modooseoul.domain.player.dto.message.PlayerInGameInfoMessage;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;

import online.ft51land.modooseoul.domain.stock.entity.Stock;
import online.ft51land.modooseoul.domain.stock.repository.StockRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class GameService {

    private final GameRepository gameRepository;
    private final MessageNumRepository messageNumRepository;
    private final PlayerRepository playerRepository;

    private final NewsRepository newsRepository;
    private final BoardRepository boardRepository;
    private final BoardStatusRepository boardStatusRepository;
    private final GameStockRepository gameStockRepository;
    private final StockRepository stockRepository;


    public Game getGameById(String gameId) {
        return gameRepository.findById(gameId)
                             .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));
    }

    public GameCreateResponseDto create() {
        Game game = gameRepository.save(new Game());
        MessageNum messageNum = messageNumRepository.save(new MessageNum(game.getId()));
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
        for (Player player : players) {
            player.playerInit();
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
            log.info("stock id = {}", gameStock.getId());
            log.info("stock price = {}", gameStock.getStocksPrice());
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

    public void startRound(Game game) {
        game.roundStart();
    }
}
