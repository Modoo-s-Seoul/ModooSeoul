package online.ft51land.modooseoul.domain.synergy.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import online.ft51land.modooseoul.domain.building.entity.Building;

@Getter
@Entity
@NoArgsConstructor
@ToString
public class Synergy {

    @Id
    private Long id;

    @Column(name = "first_building_id")
    private Long firstBuilding;

    @Column(name = "second_building_id")
    private Long secondBuilding;

    private String description;
}
