package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerLeaveMessage(
		String nickname
) {
	public static PlayerLeaveMessage of(Player player) {
		return PlayerLeaveMessage
				.builder()
				.nickname(player.getNickname())
				.build();
	}
}
