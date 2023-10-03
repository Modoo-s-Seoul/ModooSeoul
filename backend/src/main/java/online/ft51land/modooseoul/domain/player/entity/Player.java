package online.ft51land.modooseoul.domain.player.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.stock_board.entity.StockBoard;
import online.ft51land.modooseoul.utils.entity.BaseEntity;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Getter
@RedisHash(value = "player")
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
    select_news_id: 확인한 뉴스의 id
    plus_news_id: 찬스카드에서 추가로 확인한 뉴스의 id
    reportee_player_name : 피고자(신고를 당한 사람)
    turn_num : 본인 턴 번호 0 ~ 4
    is_bankrupt :  파산여부
    is_prisoned :  감금여부
    is_finish : 공통 턴 완료 여부
    dividend : 해당 라운드 수령 배당금
    stockBoardId : 플레이어 주식 보드 아이디
    chance_num: 찬스카드 번호
     */
    @Id
    private String id;

    @Column(nullable = false)
    private String nickname;

    @Indexed
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

    @Column(name = "plus_news_id")
    private Long plusNewsId;

    @Column(name = "reportee_player_name")
    private String reporteePlayerName;

    @Column(name ="turn_num")
    private Long turnNum;

    @Column(name ="is_bankrupt")
    private Boolean isBankrupt;

    @Column(name = "is_prisoned")
    private Boolean isPrisoned;

    private Boolean  isFinish;

    private Long dividend;

    private String stockBoardId;


    @Column(name = "chance_num")
    private Long chanceNum;

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

        this.currentBoardIdx = 1L;
        this.dice = 0L;
        this.isDouble = false;
        this.selectNewsId = 0L;
        this.plusNewsId = 0L;

        this.tax = 0L;
        this.isArrested = false;
        this.estates = new ArrayList<>();
        this.isBankrupt = false;
        this.isPrisoned = false;

        this.turnNum = turnNum;
        this.isFinish = false;

        this.dividend = 0L;
    }

    public void setStockBoardId(String stockBoardId) {
        this.stockBoardId = stockBoardId;
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

    public void setIsPrisoned(Boolean isPrisoned) {
        this.isPrisoned = isPrisoned;
    }

    public void setNextRound(Long stockMoney) {
        if (this.tax == 1L) // 신고당한 애들
            this.tax = 0L;
        this.setIsPrisoned(false);
        this.stockMoney = stockMoney;
    }

    public void payToll(Long toll) {
        this.cash -= toll;
    }

    public void receiveToll(Long toll) {
        this.cash += toll;
    }

    public void sellAllStock(StockBoard stockBoard) {
        this.cash += this.stockMoney;
        this.stockMoney = 0L;

        for (int i = 0; i < stockBoard.getGameStockIds().size(); i++) {
            stockBoard.setStockMoneys(i, 0L);
            stockBoard.setStockAmounts(i, 0L);
        }
    }

    public void tradeStock(Long totalPrice) {
        // totalPrice 가 음수면 판매
        this.stockMoney += totalPrice;

        // 현금에 반영
        this.cash -= totalPrice;
    }

    public void bankrupt() {
        this.isBankrupt = true;
        this.cash = 0L;
        this.stockMoney = 0L;
        this.estateMoney = 0L;
    }

    public void finish(){
        this.isFinish = true;
    }

    public void finishInit(){
        this.isFinish = false;
    }

    public void setDevidend() {
        // 10% 적용하고 반올림하기 ex. 1940 -> 190, 19800 -> 19.8 -> 20 -> 2000
        Double tmp = (double)this.stockMoney / 1000;
        this.dividend = Math.round(tmp) * 100; // 10% 적용, 20% 적용은 200, 12%는 120
        this.cash += dividend;
    }

    public void setTax(Long tax) {
        this.tax = tax;
    }

    public void taxPayment() {
        this.cash -= this.tax; // 보유한 현금에서 세금만큼 지불
        setTax(0L); // 남은 세금 0으로
    }

    public void setReporteePlayerName(String name) {
        this.reporteePlayerName = name;
    }

    public Long paySubwayFee(){
        this.cash -= 100000;
        return this.cash;
    }

    public void payPenalty(Long penalty) {
        this.cash -= penalty;
    }

    public void receivePenalty(Long penalty) {
        this.cash += penalty;
    }

    public void setChanceNum(Long chanceNum) {
        this.chanceNum = chanceNum;
    }

    public void setSelectNewsId(Long cardIdx) {
        this.selectNewsId = cardIdx;
    }

    public void winLotto() {
        this.cash += 1_000_000L;
    }

    public void setNews() {
        this.selectNewsId = 0L;
        this.plusNewsId = 0L;
    }

    public void setPlusNewsId(Long cardIdx) {
        this.plusNewsId = cardIdx;
    }
}
