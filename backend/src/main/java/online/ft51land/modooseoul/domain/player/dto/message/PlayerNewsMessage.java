package online.ft51land.modooseoul.domain.player.dto.message;

import lombok.Builder;
import online.ft51land.modooseoul.domain.news.entity.News;

@Builder
public record PlayerNewsMessage(
		String description
) {
	public static PlayerNewsMessage of(News news) {
		return PlayerNewsMessage
				.builder()
				.description(news.getDescription())
				.build();
	}
}
