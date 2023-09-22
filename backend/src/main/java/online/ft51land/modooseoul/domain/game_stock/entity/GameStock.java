package online.ft51land.modooseoul.domain.game_stock.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import online.ft51land.modooseoul.domain.stock.entity.Stock;
import org.springframework.data.redis.core.RedisHash;

@Getter
@RedisHash(value = "game_stock", timeToLive = 10000) // Redis Repository 사용을 위한
@NoArgsConstructor
public class GameStock {

	@Id
	String id;

	@Column(name = "stocksPrice")
	Long stocksPrice;

	public GameStock(Stock stock, String gameId) {
		this.id = gameId + "@" + stock.getId();
		this.stocksPrice = stock.getPrice();
	}

	public void setStocksPrice(Long stocksPrice) {
		this.stocksPrice = stocksPrice;
	}
}
