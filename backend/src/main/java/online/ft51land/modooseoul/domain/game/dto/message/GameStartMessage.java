package online.ft51land.modooseoul.domain.game.dto.message;

import lombok.Builder;

@Builder
public record GameStartMessage(
		Boolean isStart,
		String message
) {
	public static GameStartMessage of(Boolean isStart, String message) {
		return GameStartMessage.builder()
				.isStart(isStart)
				.message(message)
				.build();
	}
}
