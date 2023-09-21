package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerReadyInfoMessage(
		String nickname,
		Boolean isReady
) {
	public static PlayerReadyInfoMessage of(Player player){
		return PlayerReadyInfoMessage.builder()
		                             .nickname(player.getNickname())
		                             .isReady(player.getIsReady())
		                             .build();
	}
}
