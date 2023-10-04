package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.player.entity.Player;

@Builder
public record PlayerSubwayMessage(
        Long currentBoardId,

        Long cash,
        Boolean isSalary
) {
    public static PlayerSubwayMessage of(Player player, Boolean isSalary){
        return PlayerSubwayMessage.builder()
                .currentBoardId(player.getCurrentBoardIdx())
                .isSalary(isSalary)
                .cash(player.getCash())
                .build();
    }
}
