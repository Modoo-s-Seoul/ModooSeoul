package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerInfoMessage(
		String nickname,
		Boolean isReady
) {
	public static PlayerInfoMessage of(Player player){
		return PlayerInfoMessage.builder()
		                        .nickname(player.getNickname())
		                        .isReady(player.getIsReady())
		                        .build();
	}
}
