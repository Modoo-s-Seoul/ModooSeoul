package online.ft51land.modooseoul.domain.board.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import online.ft51land.modooseoul.domain.board.entity.enums.BoardType;

@Getter
@Entity
@NoArgsConstructor
public class Board {

    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "board_type", nullable = false)
    private BoardType boardType;

    @Column(name = "district_name")
    private String districtName;

    private Long price;

    @Column(name = "special_name")
    private String specialName;

    private String description;

}
