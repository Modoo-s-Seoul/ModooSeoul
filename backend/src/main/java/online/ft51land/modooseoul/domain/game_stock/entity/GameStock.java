package online.ft51land.modooseoul.domain.game_stock.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import online.ft51land.modooseoul.domain.stock.entity.Stock;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.List;

@Getter
@RedisHash(value = "game_stock") // Redis Repository 사용을 위한
@NoArgsConstructor
public class GameStock {

	@Id
	String id;

	@Column(name = "stock_price")
	Long stockPrice;

	@Column(name = "stock_name")
	String stockName;

	List<Long> stockPriceHistory;

	public GameStock(Stock stock, String gameId) {
		this.id = gameId + "@" + stock.getId();
		this.stockPrice = stock.getPrice();
		this.stockName = stock.getName();
		this.stockPriceHistory = new ArrayList<>();
		stockPriceHistory.add(stockPrice);
	}

	public void setStocksPrice(Long stockPrice) {
		this.stockPrice = stockPrice;
		stockPriceHistory.add(this.stockPrice);
	}
}
