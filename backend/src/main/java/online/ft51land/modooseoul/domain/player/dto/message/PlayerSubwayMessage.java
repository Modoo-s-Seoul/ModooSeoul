package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerSubwayMessage(
        Long currentBoardIdx
) {
    public static PlayerDiceMessage from(Long currentBoardIdx){
        return PlayerDiceMessage.builder()
                .currentBoardIdx(currentBoardIdx)
                .build();
    }
}
