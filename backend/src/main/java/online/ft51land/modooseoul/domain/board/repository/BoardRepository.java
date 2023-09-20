package online.ft51land.modooseoul.domain.board.repository;

import online.ft51land.modooseoul.domain.board.entity.Board;
import org.springframework.data.repository.CrudRepository;

public interface BoardRepository extends CrudRepository<Board, String> {
}

