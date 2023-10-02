package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;

@Builder
public record PlayerChanceMessage(
        String name,
        String description
) {
    public static PlayerChanceMessage of(String name, String description) {
        return PlayerChanceMessage.builder()
                .name(name)
                .description(description)
                .build();
    }

}
