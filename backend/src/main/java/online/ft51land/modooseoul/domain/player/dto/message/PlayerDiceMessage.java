package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerDiceMessage (
		Long first,
		Long second,
		Boolean isDouble
) {
	public static PlayerDiceMessage of(Long one, Long two, Player player) {
		return PlayerDiceMessage.builder()
				.first(one).second(two).isDouble(player.getIsDouble())
				.build();
	}
}
