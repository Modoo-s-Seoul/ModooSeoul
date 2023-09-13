package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerReadyMessage(
		String nickname,
		Boolean isReady
) {
	public static PlayerReadyMessage of(Player player){
		return PlayerReadyMessage.builder()
		                         .nickname(player.getNickname())
		                         .isReady(player.getIsReady())
		                         .build();
	}
}
