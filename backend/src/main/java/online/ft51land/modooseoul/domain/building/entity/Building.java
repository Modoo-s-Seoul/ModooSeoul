package online.ft51land.modooseoul.domain.building.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
public class Building {

    @Id
    private Long Id;

    private String name;

    private Long price;
}
