package online.ft51land.modooseoul.domain.player.repository;

import online.ft51land.modooseoul.domain.player.entity.Player;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PlayerRepository extends CrudRepository<Player, String> {
    List<Player> findAllByGameId(String gameId);

}

