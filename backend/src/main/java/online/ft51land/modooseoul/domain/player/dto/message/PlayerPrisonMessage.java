package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerPrisonMessage(
		Boolean isPrisoned
) {
	public static PlayerPrisonMessage of(Player player) {
		return PlayerPrisonMessage
				.builder()
				.isPrisoned(player.getIsPrisoned())
				.build();
	}
}
