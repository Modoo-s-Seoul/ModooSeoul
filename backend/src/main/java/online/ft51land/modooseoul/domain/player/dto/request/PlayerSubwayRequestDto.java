package online.ft51land.modooseoul.domain.player.dto.request;

import lombok.Builder;
@Builder
public record PlayerSubwayRequestDto(
        Long boardId
) {
    public static PlayerSubwayRequestDto of(Long boardId){
        return PlayerSubwayRequestDto.builder()
                .boardId(boardId)
                .build();
    }
}
