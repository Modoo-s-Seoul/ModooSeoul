package online.ft51land.modooseoul.domain.player.dto.request;

import lombok.Builder;

@Builder
public record PlayerFTOilLandRequestDto(
        Long boardId
) {
    public static PlayerFTOilLandRequestDto of(Long boardId){
        return PlayerFTOilLandRequestDto.builder()
                .boardId(boardId)
                .build();
    }
}
