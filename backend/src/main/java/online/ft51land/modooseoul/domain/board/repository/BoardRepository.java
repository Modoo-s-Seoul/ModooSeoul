package online.ft51land.modooseoul.domain.board.repository;

import online.ft51land.modooseoul.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, String> {
}

