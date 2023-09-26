package online.ft51land.modooseoul.domain.stock_board.entity.enums;

public enum StockProfitType {
	LOSS("손실"),
	HOLD("보합"),
	PROFIT("이익");
	private final String message;

	StockProfitType(String message) {
		this.message = message;
	}
}
