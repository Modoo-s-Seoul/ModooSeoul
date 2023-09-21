package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.Game;

@Builder
public record GameTurnMessage(
		Long turnInfo
) {
	public static GameTurnMessage of(Game game) {
		return GameTurnMessage
				.builder()
				.turnInfo(game.getTurnInfo())
				.build();
	}
}
