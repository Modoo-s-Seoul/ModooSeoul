package online.ft51land.modooseoul.domain.stock_board.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.stock_board.dto.message.StockBoardMessage;
import online.ft51land.modooseoul.domain.stock_board.dto.request.StockBoardRequestDto;
import online.ft51land.modooseoul.domain.stock_board.entity.StockBoard;
import online.ft51land.modooseoul.domain.stock_board.repository.StockBoardRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
//@Transactional
public class StockBoardService {

	private final PlayerRepository playerRepository;
	private final StockBoardRepository stockBoardRepository;

	public int getIdxByName(String stockName, List<GameStock> gameStocks) {
		for (int i = 0; i < gameStocks.size(); i++) {
			GameStock gameStock = gameStocks.get(i);
			if (Objects.equals(gameStock.getStockName(), stockName))
				return i;
		}
		return -1;
	}

	public StockBoardMessage purchaseStock(Player player, StockBoardRequestDto dto, List<GameStock> gameStocks) {
		// 해당 주식 가격 가져오기
		String name = dto.stockName();
		Long amount = dto.stockAmount();

		// amount 로 0 이 올 경우 그냥 이해하고 넘어가주기
		if (amount == 0) {
			return null;
		}

		int idx = getIdxByName(name, gameStocks);

		GameStock gameStock = gameStocks.get(idx);
		Long price = gameStock.getStockPrice();

		// 사려고 하는 총 금액
		Long totalPrice = price * amount;

		// 보유 현금과 구매희망 금액 비교
		if (player.getCash() < totalPrice) {
			return StockBoardMessage.error(ErrorMessage.CANNOT_BUY_STOCK.getPhrase());
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

		// 저장
		playerRepository.save(player);
		stockBoardRepository.save(stockBoard);

		// 메시지 가공

		return StockBoardMessage.of(player, stockBoard, gameStocks);
	}

	public StockBoardMessage sellStock(Player player, StockBoardRequestDto dto, List<GameStock> gameStocks) {
		// 보드 불러오기
		String name = dto.stockName();
		Long amount = dto.stockAmount();

		// amount 로 0 이 올 경우 그냥 이해하고 넘어가주기
		if (amount == 0) {
			return null;
		}

		int idx = getIdxByName(name, gameStocks);

		StockBoard stockBoard = stockBoardRepository
				.findById(player.getId() + "@stockBoard")
				.orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_BOARD_NOT_FOUND));

		// 가격 가져오기
		Long price = gameStocks.get(idx).getStockPrice();

		// 보유한 주식가 판매 희망 수보다 적을 경우
		if (stockBoard.getStockAmounts().get(idx) < amount) {
			return StockBoardMessage.error(ErrorMessage.CANNOT_SELL_STOCK.getPhrase());
		}


		// 주식 별 보유수 수정
		stockBoard.setStockAmounts(idx, amount * (-1));

		// 주식 별 보유금 수정
		stockBoard.setStockMoneys(idx, (price * amount) * (-1));

		// 총 주식 보유금 수정
		player.tradeStock((price * amount) * (-1));

		// 세금 설정
		player.setTax(player.getTax() + ((price * amount) / 1000) * 100);

		// 저장
		playerRepository.save(player);
		stockBoardRepository.save(stockBoard);

		// 메시지 가공 후 반환
		return StockBoardMessage.of(player, stockBoard, gameStocks);
	}

	public StockBoardMessage getStockInfo(Player player, List<GameStock> gameStocks) {
		// 보드 불러오기
		StockBoard stockBoard = stockBoardRepository
				.findById(player.getId() + "@stockBoard")
				.orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_BOARD_NOT_FOUND));

		return StockBoardMessage.of(player, stockBoard, gameStocks);
	}
}
