package online.ft51land.modooseoul.domain.game_stock.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game_stock.entity.GameStock;
import online.ft51land.modooseoul.domain.game_stock.repository.GameStockRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
//@Transactional
public class GameStockService {

	private final GameStockRepository gameStockRepository;


	public List<GameStock> getGameStockById(Game game){
		List<GameStock> gameStocks = new ArrayList<>();

		for (String gameStockId : game.getGameStockIds()) {
			gameStocks.add(gameStockRepository
					.findById(gameStockId)
					.orElseThrow(() -> new BusinessException(ErrorMessage.STOCK_NOT_FOUND)));
		}
		return gameStocks;
	}
}
