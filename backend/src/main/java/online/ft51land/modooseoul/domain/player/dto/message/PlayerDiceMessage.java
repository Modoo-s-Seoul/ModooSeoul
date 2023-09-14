package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerDiceMessage (
		Long first,
		Long second,
		Boolean isDouble
) {
	public static PlayerDiceMessage of(Long first, Long second, Player player) {
		return PlayerDiceMessage.builder()
				.first(first).second(second).isDouble(player.getIsDouble())
				.build();
	}
}
