package online.ft51land.modooseoul.domain.player.service;

import lombok.RequiredArgsConstructor;
import online.ft51land.modooseoul.domain.player.dto.message.PlayerReadyMessage;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerWebSocketSendService {

	private final PlayerRepository playerRepository;
	private final GameRepository gameRepository;

	public List<PlayerReadyMessage> sendAllReadyStatusToRoom(Player player) {
		// 방 객체 받아오기
		String roomId = player.getGameId();
		Game game = gameRepository.findById(roomId)
		                          .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

		// Message 만들기
		List<PlayerReadyMessage> message = new ArrayList<>();
		List<String> players = game.getPlayers();

		for (String playerId : players) {
			Player p = playerRepository.findById(playerId)
					.orElseThrow(() -> new BusinessException(ErrorMessage.PLAYER_NOT_FOUND));
			message.add(PlayerReadyMessage.of(p));
		}
		return  message;
	}
}
