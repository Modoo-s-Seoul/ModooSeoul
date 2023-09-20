package online.ft51land.modooseoul.domain.board_status.entity;

import jakarta.persistence.Column;
import online.ft51land.modooseoul.domain.board_status.entity.enums.BoardType;
import online.ft51land.modooseoul.utils.entity.BaseEntity;

import java.util.List;

public class BoardStatus extends BaseEntity {
    /*
    *
    * id : 방 id +'@'+ 1~ autoincrease
    * board_type : 땅 타입
    * name : 땅 이름
    * price : 구매 가격
    * description : 카드 내용
    * owner_id : 소유자
    * buildings : 건물들 정보
    * synergy : 시너지 수치
    * oil : 오일 수치
    * */

    private String id;

    @Column(name="board_type")
    private BoardType boardType;

    private String name;

    private Long price;

    private String description;

    @Column(name="owner_id")
    private String ownerId;

    private List<String> buildings;

    private Long synergy;

    private Long oil;


}
