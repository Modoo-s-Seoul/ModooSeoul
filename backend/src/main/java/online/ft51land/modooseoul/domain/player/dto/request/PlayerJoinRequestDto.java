package online.ft51land.modooseoul.domain.player.dto.request;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerJoinRequestDto(
		String nickname,
		String roomId
) {
	public Player toPlayer(){
		return new Player(this.nickname, this.roomId);
	}
}
