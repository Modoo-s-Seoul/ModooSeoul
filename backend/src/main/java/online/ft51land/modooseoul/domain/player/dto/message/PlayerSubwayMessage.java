package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerSubwayMessage(
        Long currentBoardId,
        Boolean isSalary
) {
    public static PlayerSubwayMessage of(Long currentBoardId, Boolean isSalary){
        return PlayerSubwayMessage.builder()
                .currentBoardId(currentBoardId)
                .isSalary(isSalary)
                .build();
    }
}
