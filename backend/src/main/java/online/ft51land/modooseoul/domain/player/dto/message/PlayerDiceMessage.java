package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerDiceMessage (
		int first,
		int second,
		Boolean isDouble
) {
	public static PlayerDiceMessage of(int one, int two, Player player) {
		return PlayerDiceMessage.builder()
				.first(one).second(two).isDouble(player.getIsDouble())
				.build();
	}
}
