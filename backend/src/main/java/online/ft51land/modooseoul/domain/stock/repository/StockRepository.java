package online.ft51land.modooseoul.domain.stock.repository;

import online.ft51land.modooseoul.domain.stock.entity.Stock;
import org.springframework.data.repository.CrudRepository;

public interface StockRepository extends CrudRepository<Stock, Long> {
}
