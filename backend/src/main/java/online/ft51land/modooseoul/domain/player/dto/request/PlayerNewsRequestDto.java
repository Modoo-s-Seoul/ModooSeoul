package online.ft51land.modooseoul.domain.player.dto.request;

import lombok.Builder;

@Builder
public record PlayerNewsRequestDto(
		Long currentRound,
		Long cardIdx
) {
	public static PlayerNewsRequestDto of(Long currentRound, Long cardIdx){
		return PlayerNewsRequestDto.builder()
				.currentRound(currentRound)
				.cardIdx(cardIdx)
				.build();
	}
}
