package online.ft51land.modooseoul.domain.building.repository;

import online.ft51land.modooseoul.domain.building.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {
}

