package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerNewsMessage(
		String description
) {
	public static PlayerNewsMessage of(String description) {
		return PlayerNewsMessage
				.builder()
				.description(description)
				.build();
	}
}
