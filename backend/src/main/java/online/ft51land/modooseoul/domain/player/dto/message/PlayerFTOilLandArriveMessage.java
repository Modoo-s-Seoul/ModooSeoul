package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

import java.util.List;

@Builder
public record PlayerFTOilLandArriveMessage(
        Boolean isFTOilLand,
        Boolean isPayble,
        Boolean isEstatesNotNull,
        List<Long> estates
) {
    public static PlayerFTOilLandArriveMessage of(Boolean isFTOilLand, Boolean isPayble, Boolean isEstatesNotNull, List<Long> estates){
        return PlayerFTOilLandArriveMessage.builder()
                .isFTOilLand(isFTOilLand)
                .isPayble(isPayble)
                .isEstatesNotNull(isEstatesNotNull)
                .estates(estates)
                .build();
    }
}
