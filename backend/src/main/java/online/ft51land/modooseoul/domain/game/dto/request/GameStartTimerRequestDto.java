package online.ft51land.modooseoul.domain.game.dto.request;

import lombok.Builder;

@Builder
public record GameStartTimerRequestDto(
		Long seconds
) { }
