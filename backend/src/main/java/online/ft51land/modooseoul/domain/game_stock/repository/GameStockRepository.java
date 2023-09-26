package online.ft51land.modooseoul.domain.game_stock.repository;

import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import org.springframework.data.repository.CrudRepository;

public interface GameStockRepository extends CrudRepository<GameStock, String> {
}
