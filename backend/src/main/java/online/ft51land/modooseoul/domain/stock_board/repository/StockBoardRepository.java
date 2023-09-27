package online.ft51land.modooseoul.domain.stock_board.repository;

import online.ft51land.modooseoul.domain.stock_board.entity.StockBoard;
import org.springframework.data.repository.CrudRepository;

public interface StockBoardRepository extends CrudRepository<StockBoard, String> {
}
