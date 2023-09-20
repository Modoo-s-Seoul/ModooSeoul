package online.ft51land.modooseoul.domain.board_status.repository;

import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import org.springframework.data.repository.CrudRepository;

public interface BoardStatusRepository extends CrudRepository<BoardStatus, String> {
}
