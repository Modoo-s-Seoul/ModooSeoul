package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerDividendMessage(
		Long dividend
) {
	public static PlayerDividendMessage of(Player player) {
		return PlayerDividendMessage
				.builder()
				.dividend(player.getDividend())
				.build();
	}
}
