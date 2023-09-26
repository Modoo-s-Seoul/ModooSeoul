package online.ft51land.modooseoul.domain.stock_board.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.stock_board.entity.enums.StockProfitType;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Getter
@RedisHash(value = "game_stock") // Redis Repository 사용을 위한
@NoArgsConstructor
public class StockBoard {

	/*
	id : 주식보드 아이디
	playerId : 플레이어 아이디
	StockProfitType : 손익 여부
	prevStockMoney : 전라운드 주식 금액
	gameStockIds : 게임 주식 이름들
	averagePurchases : 주식별 평균 매입가
	stocksAmount : 주식별 보유수
	stocksMoney : 주식별 보유금
	 */


	@Id
	private String id;

	@Column(name = "player_id")
	private String playerId;

	@Column(name = "stock_profit_type")
	private StockProfitType stockProfitType;

	@Column(name = "prev_stock_money")
	private Long prevStockMoney;

	@Column(name = "game_stock_names")
	private List<String> gameStockIds;

	@Column(name = "average_purchases")
	private List<Long> averagePurchases;

	@Column(name = "stock_amounts")
	private List<Long> stockAmounts;

	@Column(name = "stock_moneys")
	private List<Long> stockMoneys;

	@Column(name = "stock_purchase_amounts")
	private List<Long> stockPurchaseAmounts;

	public StockBoard(String playerId) {
		this.id = playerId + "@stockBoard";
		this.playerId = playerId;
		this.stockProfitType = StockProfitType.HOLD;
		this.prevStockMoney = 0L;
		this.gameStockIds = new ArrayList<>();
		this.averagePurchases = new ArrayList<>();
		this.stockAmounts = new ArrayList<>();
		this.stockMoneys = new ArrayList<>();
		this.stockPurchaseAmounts = new ArrayList<>();
	}

	public void stockBoardinit(Game game) {
		for (String gameStockId : game.getGameStockIds()) {
			this.gameStockIds.add(gameStockId);
			this.averagePurchases.add(0L);
			this.stockAmounts.add(0L);
			this.stockMoneys.add(0L);
			this.stockPurchaseAmounts.add(0L);
			log.info("name = {}", gameStockId);
		}
	}

	public void nextRound(Player player) {
		Long margin = player.getStockMoney() - this.prevStockMoney;

		if (margin < 0) // 손실
			this.stockProfitType = StockProfitType.LOSS;
		else if (margin > 0) // 이득
			this.stockProfitType = StockProfitType.PROFIT;
		else // 유지
			this.stockProfitType = StockProfitType.HOLD;

		this.prevStockMoney = player.getStockMoney();
	}

	public void setStockAmounts(int idx, Long amount) {
		// 판매 시에는 amount 가 음수로 들어옴
		stockAmounts.set(idx, stockAmounts.get(idx) + amount);
	}



	public void setStockMoneys(int idx, Long totalPrice) {
		stockMoneys.set(idx, stockMoneys.get(idx) + totalPrice);
	}

	public void setAveragePurchases(int idx, Long price, Long amount) {
		// 전라운드 구입량
		Long prevAmount = stockPurchaseAmounts.get(idx);

		// 이번라운드까지의 구입량
		stockPurchaseAmounts.set(idx, stockPurchaseAmounts.get(idx) + amount);

		// 전라운드 매입금액
		Long average = averagePurchases.get(idx) * prevAmount;

		// 이번라운드 매입 금액까지 합한 금액
		average += (price * amount);

		// 총 매입금액을 총 매입 주식 수로 나누기 (100의 자리까지만)
		average /= stockPurchaseAmounts.get(idx);
		average = (average / 100) * 100;

		// 저장
		averagePurchases.set(idx, average);

	}

}
