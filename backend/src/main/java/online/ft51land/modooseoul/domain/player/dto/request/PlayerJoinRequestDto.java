package online.ft51land.modooseoul.domain.player.dto.request;

import lombok.Builder;

@Builder
public record PlayerJoinRequestDto(
		Long SessionId,
		String nickName,
		String roomNumber
) {
	public PlayerJoinRequestDto toPlayer() {
		return new PlayerJoinRequestDto(
				this.SessionId,
				this.nickName,
				this.roomNumber
		) ;
	}
}
