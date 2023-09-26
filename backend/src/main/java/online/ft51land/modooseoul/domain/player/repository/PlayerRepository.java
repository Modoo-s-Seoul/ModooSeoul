package online.ft51land.modooseoul.domain.player.repository;

import online.ft51land.modooseoul.domain.player.entity.Player;
import org.springframework.data.repository.CrudRepository;

public interface PlayerRepository extends CrudRepository<Player, String> {
}

