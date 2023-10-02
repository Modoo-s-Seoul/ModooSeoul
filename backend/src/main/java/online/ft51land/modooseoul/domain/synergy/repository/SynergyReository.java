package online.ft51land.modooseoul.domain.synergy.repository;

import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.building.entity.Building;
import online.ft51land.modooseoul.domain.synergy.entity.Synergy;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SynergyReository extends JpaRepository<Synergy, Long> {

    Boolean existsByFirstBuildingAndSecondBuilding(Long firstBuilding, Long secondBudilding);

}
