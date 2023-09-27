package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.game.entity.Game;

@Builder
public record PlayerFinishMessage(
		Long finishedPlayerCnt,

		Boolean isTimerActivated,
		Long turnInfo

) {
	public static PlayerFinishMessage of(Game game) {
		return PlayerFinishMessage.builder()
				.finishedPlayerCnt(game.getFinishedPlayerCnt())
				.isTimerActivated(game.getIsTimerActivated())
				.turnInfo(game.getTurnInfo())
				.build();
	}
}
