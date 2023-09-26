package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

import java.util.List;

@Builder
public record GameEndMessage(
        List<Player> playerList
) {
    public static GameEndMessage of(List<Player> playerList) {
        return GameEndMessage
                .builder()
                .playerList(playerList)
                .build();
    }
}
