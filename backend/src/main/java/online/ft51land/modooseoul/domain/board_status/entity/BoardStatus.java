package online.ft51land.modooseoul.domain.board_status.entity;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import online.ft51land.modooseoul.domain.board.entity.Board;
import online.ft51land.modooseoul.domain.board.entity.enums.BoardType;
import online.ft51land.modooseoul.utils.entity.BaseEntity;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Getter
@RedisHash(value = "board_status", timeToLive = 10000) // Redis Repository 사용을 위한
@AllArgsConstructor
public class BoardStatus extends BaseEntity {
    /*
    *
    * id : 방 id +'@'+ 1~ autoincrease
    * board_type : 땅 타입
    * special_name : 특수칸 이름
    * description : 특수칸 내용
    * district_name : 지역구 이름
    * price : 구매 가격
    * owner_id : 소유자
    * buildings : 건물들 정보
    * synergy : 시너지 수치
    * oil : 오일 수치
    * */

    private String id;

    @Column(name="board_type")
    private BoardType boardType;

    @Column(name = "special_name")
    private String specialName;

    private String description;

    @Column(name = "district_name")
    private String districtName;
    
    private Long price;


    @Column(name="owner_id")
    private String ownerId;

    private List<Long> buildings;

    private Long synergy;

    private Long oil;

    public BoardStatus(String gameId, Board board){
        this.id = gameId +"@"+board.getId();
        this.boardType = board.getBoardType();
        this.specialName  = board.getSpecialName();
        this.description = board.getDescription();
        this.districtName = board.getDistrictName();
        this.price = board.getPrice();
    }
    public void purchaseGround(String playerId) {
        this.ownerId = playerId;
    }
}
