package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerEvasionMessage(
		Boolean isEvade,
		String reporteeName,
		String message
) {
	static public PlayerEvasionMessage ofReporter(Player player, Boolean isEvade) {
		String message;
		if (isEvade) {
			message = "탈세범을 검거하였습니다! 포상금 500만원을 지급합니다.";
		}
		else {
			message = "신고한 플레이어는 탈세범이 아니었습니다. 벌금 100만원을 부과합니다.";
		}
		return PlayerEvasionMessage
				.builder()
				.isEvade(isEvade)
				.reporteeName(player.getReporteePlayerName())
				.message(message)
				.build();
	}

	static public PlayerEvasionMessage ofReportee(Boolean isEvade) {
		String message;
		if (isEvade) {
			message = "당신의 탈세가 검거되었습니다. 탈세금의 3배를 징수합니다.";
		}
		else {
			message = "누군가 선량한 당신을 탈세범으로 신고하였습니다. 위로금을 수령합니다.";
		}
		return PlayerEvasionMessage
				.builder()
				.isEvade(isEvade)
				.message(message)
				.build();
	}
}
