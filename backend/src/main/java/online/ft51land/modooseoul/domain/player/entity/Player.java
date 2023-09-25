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
import java.util.Timer;
import java.util.TimerTask;

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
    estate_money : 부동산 보유금
    estates: 소유 부동산 List
    tax: 미납금
    dice : 주사위
    already_double: 이미 더블했는지 여부
    is_arrested: 검거 여부
    select_stock_id: 확인한 뉴스의 종목
    reportee_player_id : 피고자(신고를 당한 사람)
    turn_num : 본인 턴 번호 0 ~ 4
    is_bankrupt :  파산여부

     */
    @Id
    private String id;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "gamd_id",nullable = false )
    private String gameId;

    @Column(name = "is_ready", nullable = false)
    private Boolean isReady;

    @Column(name ="current_board_idx")
    private Long currentBoardIdx;

    private Long cash;

    @Column(name = "stock_money")
    private Long stockMoney;

    @Column(name="estate_money")
    private Long estateMoney;

    private List<Long> estates;

    private Long tax;

    private Long dice;

    @Column(name = "is_double")
    private Boolean isDouble;

    @Column(name = "is_arrested")
    private Boolean isArrested;

    @Column(name = "select_news_id")
    private Long selectNewsId;

    @Column(name = "reportee_player_id")
    private Long reporteePlayerId;

    @Column(name ="turn_num")
    private Long turnNum;

    @Column(name ="is_bankrupt")
    private Boolean isBankrupt;

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

    public void playerInit(Long turnNum) {
        this.cash = 10000000L; // 초기자금 1000만원
        this.stockMoney = 0L;
        this.estateMoney = 0L;
        this.estates = new ArrayList<>();

        this.currentBoardIdx = 1L;
        this.dice = 0L;
        this.isDouble = false;
        this.selectNewsId = 0L;

        this.tax = 0L;
        this.isArrested = false;
        this.estates = new ArrayList<>();
        this.isBankrupt = false;

        this.turnNum = turnNum;
    }

    public void playerMove(Long currentBoardId) {
        this.currentBoardIdx = currentBoardId;
    }


    public void purchaseGround(Long groundPrice) {
        this.estateMoney += groundPrice;
        this.cash -= groundPrice;
        this.estates.add(this.currentBoardIdx);
    }

    public void purchaseBuilding(Long buildingPrice) {
        this.estateMoney += buildingPrice;
        this.cash -= buildingPrice;
    }

    public void getSalary() {
        this.cash +=1000000;
    }

    public void saveEstates(List<Long> estates) {
        this.estates = estates;
    }


}
