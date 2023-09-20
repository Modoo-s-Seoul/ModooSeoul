package online.ft51land.modooseoul.domain.news.repository;

import online.ft51land.modooseoul.domain.news.entity.News;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NewsRepository extends CrudRepository<News, String> {
	List<News> findByStockId(Long stockId);
}
