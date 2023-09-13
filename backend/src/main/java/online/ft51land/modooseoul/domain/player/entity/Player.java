package online.ft51land.modooseoul.domain.player.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import online.ft51land.modooseoul.utils.entity.BaseEntity;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@RedisHash(value = "player", timeToLive = 10000)
@NoArgsConstructor //기본 생성자 생성
@Table(name = "player")
@ToString
public class Player extends BaseEntity {

    /*
    id : pk -> sessionID
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
    is_arrested: 검거 여부
    select_stock_id: 확인한 뉴스의 종목
    reportee_player_id : 피고자(신고를 당한 사람)


     */
    @Id
    @Indexed
    private String id;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false, name = "room_id")
    //나중에 Room형으로 바꾸기
    private Long roomId;

    @Column(nullable = false, name = "is_ready")
    private Boolean isReady;

    private Long currentBoardId;
    
    private Long cash;

    @Column(name = "stock_money")
    private Long stockMoney;

    @Column(name="asset_money")
    private Long assetMoney;

    private List assets;

    private Long tax;

    private Long dice;

    @Column(name = "is_arrested")
    private Boolean isArrested;

    @Column(name = "select_stock_id")
    private Long selectStockI;

    @Column(name = "reportee_player_id")
    //나중에 Player형으로 바꾸기
    private Long reporteePlayerId;

    @Builder
    public Player(String id, String nickname, Long roomId, Boolean isReady){
        this.id = id;
        this.nickname = nickname;
        this.roomId = roomId;
        this.isReady = isReady;
        this.createdDate = LocalDateTime.now();
    }
}
