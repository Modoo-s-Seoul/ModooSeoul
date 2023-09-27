package online.ft51land.modooseoul.domain.stock_board.dto.request;

import lombok.Getter;

@Getter
public record StockBoardRequestDto(
	String stockName,
	Long stockAmount

) { }
