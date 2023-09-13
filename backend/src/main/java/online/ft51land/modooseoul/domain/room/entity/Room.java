package online.ft51land.modooseoul.domain.room.entity;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.room.entity.enums.EndType;
import online.ft51land.modooseoul.utils.entity.BaseEntity;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@RedisHash(value = "room", timeToLive = 10000) // Redis Repository 사용을 위한
@AllArgsConstructor
@ToString
public class Room extends BaseEntity {

    /*
    id : pk - 방 아이디
    players :  참여자
    is_start : 상태
    start_time : 게임 시작시간
    end_time : 게임 종료 시간
    win_player_id : 승자
    end_type : 종료 타입
    stocks : 선택된 주식
    news :  선택된 뉴스
    current_round : 현재 라운드
    sum_money : 플레이어 총 자산
    message_num : 메시지 번호
     */

    @Id
    private String id;

//    @OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE)
    private List<String> players;

    @Column(name = "is_start", nullable = false)
    private Boolean isStart;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "win_player_id")
    private String winPlayerId;

    @Column(name = "end_type")
    private EndType endType;

    private List<Long> stocks;

    private List<Long> news;

    @Column(name = "current_round")
    private Long currentRound;

    @Column(name = "sum_money")
    private Long sumMoney;

    @Column(name = "message_num", nullable = false)
    private Long messageNum;


    @Builder
    public Room(){
        this.messageNum = 1L;
        this.isStart = false;
        this.players = new ArrayList<>();
        this.createdDate = LocalDateTime.now();
    }

    public List<String> addPlayer(Player player){
        this.players.add(player.getNickname());
        return this.players;
    }

    public void start() {
        this.isStart = true;
    }
}