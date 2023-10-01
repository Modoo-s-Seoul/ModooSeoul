package online.ft51land.modooseoul.domain.synergy.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import online.ft51land.modooseoul.domain.building.entity.Building;

@Getter
@Entity
@NoArgsConstructor
public class Synergy {

    @Id
    private Long id;

    @ManyToOne
    private Building firstBuilding;

    @ManyToOne
    private Building secondBuilding;

}
