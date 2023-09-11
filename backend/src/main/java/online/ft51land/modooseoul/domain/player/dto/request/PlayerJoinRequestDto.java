package online.ft51land.modooseoul.domain.player.dto.request;

public record PlayerJoinRequestDto(
		Long sessionId,
		String nickname,
		String roomNumber
) { }
