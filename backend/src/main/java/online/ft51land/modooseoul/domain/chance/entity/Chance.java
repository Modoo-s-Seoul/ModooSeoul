package online.ft51land.modooseoul.domain.chance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.chance.entity.enums.ChanceType;

@Entity
@Getter
@Slf4j
@NoArgsConstructor
public class Chance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "chance_type")
    private ChanceType chanceType;

    private String name;

    private String description;

}
