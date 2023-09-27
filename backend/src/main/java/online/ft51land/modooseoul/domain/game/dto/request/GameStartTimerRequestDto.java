package online.ft51land.modooseoul.domain.game.dto.request;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.enums.TimerType;

@Builder
public record GameStartTimerRequestDto(
		TimerType timerType
) { }
