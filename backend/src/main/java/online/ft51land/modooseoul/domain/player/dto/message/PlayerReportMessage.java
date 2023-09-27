package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerReportMessage(
		String reporteeName
) {
	public static PlayerReportMessage of(Player player) {
		return PlayerReportMessage
				.builder()
				.reporteeName(player.getReporteePlayerName())
				.build();
	}
}
