package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerTaxMessage(
		Long tax,
		Boolean status,
		String message
) {
	public static PlayerTaxMessage error(String message) {
		return PlayerTaxMessage
				.builder()
				.message(message)
				.status(false)
				.build();
	}

	public static PlayerTaxMessage of(Player player) {
		return PlayerTaxMessage
				.builder()
				.tax(player.getTax())
				.status(true)
				.build();
	}
}
