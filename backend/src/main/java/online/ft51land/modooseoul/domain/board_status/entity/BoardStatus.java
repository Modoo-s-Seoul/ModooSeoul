package online.ft51land.modooseoul.domain.board_status.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import online.ft51land.modooseoul.domain.board.entity.Board;
import online.ft51land.modooseoul.domain.board.entity.enums.BoardType;
import online.ft51land.modooseoul.utils.entity.BaseEntity;
import org.springframework.data.redis.core.RedisHash;


@Getter
@RedisHash(value = "board_status") // Redis Repository 사용을 위한
@AllArgsConstructor
@NoArgsConstructor
@ToString
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

    @Id
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

    private int[] buildings;

    private Long synergy;

    private Long oil;

    public BoardStatus(String gameId, Board board){
        this.id = gameId +"@"+board.getId();
        this.boardType = board.getBoardType();
        this.specialName  = board.getSpecialName();
        this.description = board.getDescription();
        this.districtName = board.getDistrictName();
        this.price = board.getPrice();
        this.synergy = 1L;
        this.oil = 1L;
        this.buildings = new int[4];
    }
    public void purchaseGround(String playerId) {
        this.ownerId = playerId;
    }

    public void purchaseBuilding(Long buildingIdx, Long buildingId, Long buildingPrice) {
        this.price += buildingPrice;
        this.buildings[Math.toIntExact(buildingIdx)] = Math.toIntExact(buildingId);
    }

    public void saveBuilding(int[] buildings) {
        this.buildings = buildings;
    }

    public void resetBoard(Long price) {
        this.synergy = 1L;
        this.oil = 1L;
        this.buildings = new int[4];
        this.ownerId = null;
        this.price = price;
    }

    public void addSynerge() {
        this.synergy+=1;
    }

    public void updateOil(){
        this.oil = 2L;
    }

    public void oilInit() {
        this.oil = 1L;
    }
}
