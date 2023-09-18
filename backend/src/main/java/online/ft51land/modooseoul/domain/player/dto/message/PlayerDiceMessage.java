package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerDiceMessage(
		Long first,
		Long second,
		Boolean isDouble,
		Long currentBoardId,
		Boolean isSalary
) {
	public static PlayerDiceMessage of(Long first, Long second, Player player, Boolean isSalary) {
		return PlayerDiceMessage.builder()
		                        .first(first)
		                        .second(second)
		                        .isDouble(player.getIsDouble())
		                        .currentBoardId(player.getCurrentBoardId())
								.isSalary(isSalary)
		                        .build();
	}
}
