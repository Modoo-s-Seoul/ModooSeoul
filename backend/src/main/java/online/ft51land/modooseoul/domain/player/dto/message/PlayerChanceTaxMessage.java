package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerChanceTaxMessage(
        String name,
        Boolean isEvasion
) {
    public static PlayerChanceTaxMessage of(String name, Boolean isEvasion) {
        return PlayerChanceTaxMessage.builder()
                .name(name)
                .isEvasion(isEvasion)
                .build();

    }

}
