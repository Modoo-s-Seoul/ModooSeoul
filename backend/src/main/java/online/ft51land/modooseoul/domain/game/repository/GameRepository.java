package online.ft51land.modooseoul.domain.game.repository;


import online.ft51land.modooseoul.domain.game.entity.Game;
import org.springframework.data.repository.CrudRepository;

public interface GameRepository extends CrudRepository<Game, String> {
}
