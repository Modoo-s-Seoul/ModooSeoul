package online.ft51land.modooseoul.domain.chance.repository;

import online.ft51land.modooseoul.domain.chance.entity.Chance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChanceRepository extends JpaRepository<Chance, Long> {
}
