package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerInGameInfoMessage(

		// 일단은 지금 당장 필요한 정보들만 넣어둠
		// 나중에 플레이어 개인 정보 전해줄 때 이 레코드 쓰면 될듯
		String nickname,
		Long currentBoardIdx,
		Long cash,
		Long totalAsset,
		Boolean isBankrupt
) {
	public static PlayerInGameInfoMessage of(Player player) {
		Long totalAsset = player.getCash() + player.getStockMoney()
				+ player.getEstateMoney();

		return PlayerInGameInfoMessage
				.builder()
				.cash(player.getCash())
				.currentBoardIdx(player.getCurrentBoardIdx())
				.nickname(player.getNickname())
				.totalAsset(totalAsset)
				.isBankrupt(player.getIsBankrupt())
				.build();
	}
}
