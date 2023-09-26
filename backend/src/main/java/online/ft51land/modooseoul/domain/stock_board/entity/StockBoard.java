package online.ft51land.modooseoul.domain.stock_board.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.stock_board.entity.enums.StockProfitType;
import org.springframework.data.mongodb.repository.CountQuery;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.List;

@Getter
@RedisHash(value = "game_stock") // Redis Repository 사용을 위한
@NoArgsConstructor
public class StockBoard {

	/*
	id : 주식보드 아이디
	playerId : 플레이어 아이디
	StockProfitType : 손익 여부
	prevStockMoney : 전라운드 주식 금액
	gameStockIds : 게임 주식 아이디들
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

	@Column(name = "game_stock_ids")
	private List<String> gameStockIds;

	@Column(name = "average_purchases")
	private List<Long> averagePurchases;

	@Column(name = "stock_amounts")
	private List<Long> stockAmounts;

	@Column(name = "stock_moneys")
	private List<Long> stockMoneys;

	public StockBoard(String playerId) {
		this.id = playerId + "@stockBoard";
		this.playerId = playerId;
		this.stockProfitType = StockProfitType.HOLD;
		this.prevStockMoney = 0L;
		this.gameStockIds = new ArrayList<>();
		this.averagePurchases = new ArrayList<>();
		this.stockAmounts = new ArrayList<>();
		this.stockMoneys = new ArrayList<>();
	}

	public void stockBoardinit(Game game) {
		for (Long stockId : game.getStocks()) {
			this.gameStockIds.add(game.getId() + "@" + stockId);
			this.averagePurchases.add(0L);
			this.stockAmounts.add(0L);
			this.stockMoneys.add(0L);
		}
	}
}
