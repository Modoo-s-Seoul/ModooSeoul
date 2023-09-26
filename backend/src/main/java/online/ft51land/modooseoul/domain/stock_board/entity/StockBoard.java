package online.ft51land.modooseoul.domain.stock_board.entity;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import online.ft51land.modooseoul.domain.stock_board.entity.enums.StockProfitType;
import org.springframework.data.mongodb.repository.CountQuery;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Getter
@RedisHash(value = "game_stock") // Redis Repository 사용을 위한
@NoArgsConstructor
public class StockBoard {

	/*
	stockBoardId : 주식보드 아이디
	playerId : 플레이어 아이디
	StockProfitType : 손익 여부
	prevStockMoney : 전라운드 주식 금액
	gameStockIds : 게임 주식 아이디들
	averagePrices : 주식별 평균 매입가
	stocksAmount : 주식별 보유수
	stocksMoney : 주식별 보유금
	 */


	@Column(name = "stock_board_id")
	private String stockBoardId;

	@Column(name = "player_id")
	private Long playerId;

	@Column(name = "stock_profit_type")
	private StockProfitType stockProfitType;

	@Column(name = "prev_stock_money")
	private Long prevStockMoney;

	@Column(name = "game_stock_ids")
	private List<String> gameStockIds;

	@Column(name = "average_prices")
	private List<Long> averagePrices;

	@Column(name = "stock_amounts")
	private List<Long> stockAmounts;

	@Column(name = "stock_moneys")
	private List<Long> stockMoneys;
}
