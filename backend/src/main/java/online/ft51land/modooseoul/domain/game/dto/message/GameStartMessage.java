package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;

@Builder
public record GameStartMessage(
		Boolean isStart
) {
	public static GameStartMessage of(Boolean isStart) {
		return GameStartMessage.builder()
				.isStart(isStart)
				.build();
	}
}
