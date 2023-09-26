package online.ft51land.modooseoul.domain.stock_board.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.game_stock.repository.GameStockRepository;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.stock_board.dto.message.StockBoardMessage;
import online.ft51land.modooseoul.domain.stock_board.dto.request.StockBoardRequestDto;
import online.ft51land.modooseoul.domain.stock_board.entity.StockBoard;
import online.ft51land.modooseoul.domain.stock_board.repository.StockBoardRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class StockBoardService {

	private final PlayerRepository playerRepository;
	private final StockBoardRepository stockBoardRepository;
	private final GameStockRepository gameStockRepository;

	public int getIdxByName(String stockName, List<GameStock> gameStocks) {
		for (int i = 0; i < gameStocks.size(); i++) {
			GameStock gameStock = gameStocks.get(i);
			if (Objects.equals(gameStock.getStockName(), stockName))
				return i;
		}
		return -1;
	}

	public StockBoardMessage purchaseStock(Player player, StockBoardRequestDto stockBoardRequestDto, List<GameStock> gameStocks) {
		// 해당 주식 가격 가져오기
		String name = stockBoardRequestDto.getStockName();
		int idx = getIdxByName(name, gameStocks);
		GameStock gameStock = gameStocks.get(idx);
		Long price = gameStock.getStockPrice();
		Long amount = stockBoardRequestDto.getStockAmount();

		// 사려고 하는 총 금액
		Long totalPrice = price * amount;

		// 보유 현금과 구매희망 금액 비교
		if (player.getCash() < totalPrice) {
			throw new BusinessException(ErrorMessage.CANNOT_BUY_STOCK);
		}

		// 이 밑에부터는 구매 성공하고 갱신하는 과정
		// 보드 가져오기
		StockBoard stockBoard = stockBoardRepository
				.findById(player.getId() + "@stockBoard")
				.orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_BOARD_NOT_FOUND));


		// 보유 주식 수
		stockBoard.setStockAmounts(idx, amount);

		// 총 구매량, 평균 매입금 (구매만)
		stockBoard.setAveragePurchases(idx, price, amount);

		// 주식별 보유액 (+ 플레이어 객체 총 주식 보유 금액)
		stockBoard.setStockMoneys(idx, totalPrice);
		player.tradeStock(totalPrice);
		playerRepository.save(player);

		// 저장
		stockBoardRepository.save(stockBoard);

		// 메시지 가공

		return StockBoardMessage.of(player, stockBoard, gameStocks);
	}
}
