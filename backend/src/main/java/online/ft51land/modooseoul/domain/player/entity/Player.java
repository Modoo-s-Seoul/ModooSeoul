package online.ft51land.modooseoul.domain.player.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import online.ft51land.modooseoul.utils.entity.BaseEntity;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@RedisHash(value = "player", timeToLive = 10000)
@NoArgsConstructor //기본 생성자 생성
@ToString
public class Player extends BaseEntity {

    /*
    id : pk
    session_id : 세션 아이디
    nickname : 닉네임
    room_id : 참여방
    is_ready : 준비 상태
    current_board_id : 현재 위치
    cash :  보유 현금
    stock_money: 주식 보유금
    asset_money : 부동산 보유금
    assets: 소유 부동산 List
    tax: 미납금
    dice : 주사위
    already_double: 이미 더블했는지 여부
    is_arrested: 검거 여부
    select_stock_id: 확인한 뉴스의 종목
    reportee_player_id : 피고자(신고를 당한 사람)


     */
    @Id
    private String id;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "gamd_id",nullable = false )
    private String gameId;

    @Column(name = "is_ready", nullable = false)
    private Boolean isReady;

    @Column(name ="current_board_id")
    private Long currentBoardId;
    
    private Long cash;

    @Column(name = "stock_money")
    private Long stockMoney;

    @Column(name="asset_money")
    private Long assetMoney;

    private List assets;

    private Long tax;

    private Long dice;

    @Column(name = "is_double")
    private Boolean isDouble;

    @Column(name = "is_arrested")
    private Boolean isArrested;

    @Column(name = "select_stock_id")
    private Long selectStockId;

    @Column(name = "reportee_player_id")
    private Long reporteePlayerId;

    @Builder
    public Player(String nickname, String gameId){
        this.nickname = nickname;
        this.gameId = gameId;
        this.isReady = false;
        this.createdDate = LocalDateTime.now();
    }

    public void toggleReadyStatus() {
        this.isReady = !this.isReady;
    }

    public void updateDouble(Boolean isDouble) {
        this.isDouble = isDouble;
    }

    public void updateDice(Long dice) {
        this.dice = dice;
    }

    public void playerInit() {
        this.cash = 10000000L; // 초기자금 1000만원
        this.stockMoney = 0L;
        this.assetMoney = 0L;
        this.assets = new ArrayList<>();

        this.currentBoardId = 0L;
        this.dice = 0L;
        this.isDouble = false;
        this.selectStockId = 0L;

        this.tax = 0L;
        this.isArrested = false;
    }

    public void playerMove(Long currentBoardId) {
        this.currentBoardId = currentBoardId;
    }


    public void purchaseGround(Long groundPrice) {
        this.cash -= groundPrice;
    }
}
